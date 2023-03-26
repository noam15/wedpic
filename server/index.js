import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
const cloudinary = require('cloudinary');
import { ExifImage } from 'exif';
import axios from 'axios';

const app = express();
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

app.post('/addTimeFrame', (req, res) => {
  try {
    client.db('wedpic').collection('timeframes').insertOne(req.body);
    res.send('success');
  } catch (err) {
    console.error(err);
  }
});

app.post('/addToAlbum', async (req, res) => {
  const { resources } = await cloudinary.v2.api.resources();
  client
    .db('wedpic')
    .collection('timeframes')
    .find({})
    .forEach((timeFrame) => {
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
});

app.put('/editTimeFrame', (req, res) => {});

app.delete('/deleteTimeFrame', (req, res) => {});

app.listen(8080, () => {
  console.log(`We're up!`);
});
