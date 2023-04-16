import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import cloudinary from 'cloudinary';
import pkg from 'exif';
const { ExifImage } = pkg;
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.v2.config({
  cloud_name: 'dmjqy7rx4',
  api_key: '965566542713632',
  api_secret: 'Lkkt3Vc3cHhneTZbeXJSauIKdAw',
});

const uri =
  'mongodb+srv://hillel:325605384@wedpic.4f6etky.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  console.error(err);
  client.close();
});

const timeFramesCollection = client.db('wedpic').collection('timeframes');

app.post('/addTimeFrame', (req, res) => {
  try {
    timeFramesCollection.insertOne(req.body);
    res.send('success');
  } catch (err) {
    console.error(err);
    req.send(err);
  }
});

app.get('/getTimeFrames', async (req, res) => {
  try {
    const timeFrames = await timeFramesCollection.find({}).toArray();
    res.send(timeFrames);
  } catch (err) {
    console.error(err);
    req.send(err);
  }
});

app.get('/getImagesNames', async (req, res) => {
  try {
    const { resources } = await cloudinary.v2.api.resources();
    res.send(resources.map((pic) => pic.url));
  } catch (error) {
    res.send(error);
  }
});

app.post('/addToAlbum', async (req, res) => {
  try {
    const { resources } = await cloudinary.v2.api.resources();
    timeFramesCollection.find({}).forEach((timeFrame) => {
      cloudinary.v2.api.create_folder(timeFrame.title).then(({ path }) => {
        resources.forEach(async (pic) => {
          const actualPic = await axios.get(pic.url, {
            responseType: 'arraybuffer',
          });
          new ExifImage(
            { image: Buffer.from(actualPic.data, 'utf-8') },
            (err, metadata) => {
              if (err) console.error(err);
              else {
                const dateAndTime = metadata.exif.DateTimeOriginal.split(' ');
                const date = dateAndTime[0].replace(':', '/');
                const time = dateAndTime[1];
                const imgTakenAt = new Date(date + ' ' + time);
                const timeFrameStarts = new Date(timeFrame.startTime);
                const timeFrameEnds = new Date(timeFrame.endTime);
                if (
                  imgTakenAt > timeFrameStarts &&
                  imgTakenAt < timeFrameEnds
                ) {
                  cloudinary.v2.uploader.rename(
                    pic.public_id,
                    `${path}/${pic.public_id.split('/').at(-1)}`
                  );
                }
              }
            }
          );
        });
      });
    });
  } catch (error) {
    res.send(error);
  }
});

app.put('/editTimeFrame', (req, res) => {
  console.log(req.body);
  const { _id, change } = req.body;
  try {
    const result = timeFramesCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: change }
    );
    res.send(result);
  } catch (error) {
    res.send(req.body);
  }
});

app.delete('/deleteTimeFrame', (req, res) => {
  try {
    const result = timeFramesCollection.deleteOne({ _id: req.body._id });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.listen(8080, () => {
  console.log(`We're up!`);
});
