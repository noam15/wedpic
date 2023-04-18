import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import fileUpload from 'express-fileupload';
import { randomUUID } from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

import pkg from 'exif';
const { ExifImage } = pkg;

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = dirname(__filename);
console.log(__dirname);

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('uploads'));

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

app.get('/getTimeFrames', async (req, res) => {
  try {
    const timeFrames = await timeFramesCollection.find({}).toArray();
    res.send(timeFrames);
  } catch (err) {
    console.error(err);
    req.send(err);
  }
});

app.get('/getImages', (req, res) => {
  try {
    const pics = [];
    let promisesArr = [];
    fs.readdir(join(__dirname, '/../uploads'), async (err, files) => {
      files.forEach((file) => {
        if (fs.statSync(join(__dirname, '/../uploads', file)).isDirectory()) {
          promisesArr.push(
            new Promise((resolve, reject) => {
              fs.readdir(
                join(__dirname, '/../uploads', file),
                (err, recurFiles) => {
                  recurFiles.forEach((recurFile) => {
                    pics.push(
                      fs
                        .readFileSync(
                          join(__dirname, '/../uploads', file, recurFile)
                        )
                        .toString('base64')
                    );
                    resolve();
                  });
                }
              );
            })
          );
        } else {
          pics.push(
            fs
              .readFileSync(join(__dirname, '/../uploads', file))
              .toString('base64')
          );
        }
      });
      await Promise.all(promisesArr);
      console.log(pics.length);
      res.send(pics);
    });
  } catch (error) {
    res.send(error);
  }
});

app.post('/addImages', (req, res) => {
  try {
    const saveImg = async (img) => {
      const fileType = await fileTypeFromBuffer(img.data);
      let subfolder = '';
      new ExifImage({ image: img.data }, async (err, metadata) => {
        if (err) console.error(err);
        else {
          try {
            await timeFramesCollection.find({}).forEach((timeFrame) => {
              const dateAndTime = metadata.exif.DateTimeOriginal.split(' ');
              const date = dateAndTime[0].replace(':', '/').replace(':', '/');
              const time = dateAndTime[1];
              const timeFrameStarts = new Date(parseInt(timeFrame.startTime));
              const timeFrameEnds = new Date(parseInt(timeFrame.endTime));
              const imgTakenAt = new Date(date + ' ' + time);
              imgTakenAt.setFullYear(timeFrameStarts.getFullYear());
              imgTakenAt.setMonth(timeFrameStarts.getMonth());
              imgTakenAt.setDate(timeFrameStarts.getDate());
              if (imgTakenAt >= timeFrameStarts && imgTakenAt < timeFrameEnds) {
                subfolder = timeFrame.name;
              }
            });
          } catch (err) {
            console.error(err);
          }
        }

        if (subfolder) {
          const uuid = randomUUID();
          if (!fs.existsSync(join(__dirname, '/../uploads', subfolder))) {
            fs.mkdir(join(__dirname, '/../uploads', subfolder), (err, path) => {
              if (err) console.error(err);
            });
          }
          img.mv(
            join(
              __dirname,
              '/../uploads',
              subfolder,
              uuid + '.' + fileType.ext
            ),
            (e) => {
              if (e) console.error(e);
            }
          );
        }
      });
    };
    if (Array.isArray(req.files.files)) {
      req.files.files.forEach(saveImg);
    } else {
      saveImg(req.files.files);
    }
    res.send('👍');
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/editTimeFrame', (req, res) => {
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

app.listen(8080, () => {
  console.log(`We're up!`);
});
