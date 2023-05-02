import express from 'express';
import cors from 'cors';
import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import fileUpload from 'express-fileupload';
import { randomUUID } from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

import pkg from 'exif';
import { setInterval } from 'timers';
const { ExifImage } = pkg;

const s3 = new S3({ region: 'eu-north-1' });
const bucketName = 'wedpic-1705';
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = dirname(__filename);
console.log(__dirname);

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

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
let images = [];
const imageGetter = async () => {
  s3.listObjects({ Bucket: bucketName }, function (err, data) {
    if (err) {
      console.error(err, err.stack);
    } else {
      const imageUrls = [];
      data.Contents.forEach((obj) => {
        const key = obj.Key;
        s3.listObjects({ Bucket: bucketName, Prefix: key }, function (
          err,
          folderData
        ) {
          folderData.Contents.forEach((obj) => {
            const imgKey = obj.Key;
            const imgIndex = key.indexOf('/');
            if (imgIndex > -1 && imgIndex.at(-1) != '/') {
              const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imgKey}`;
              imageUrls.push(imageUrl);
            }
          });
        });
        const index = key.indexOf('/');
        if (index > -1 && key.at(-1) != '/') {
          const imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
          imageUrls.push(imageUrl);
        }
      });

      images = imageUrls;
    }
  });
};
app.get('/getImages', (req, res) => {
  try {
    res.send(images);
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
              const dateAndTime = metadata.exif.DateTimeOriginal;
              if (dateAndTime) {
                const splitDaT = dateAndTime.split(' ');
                const date = splitDaT[0].replace(':', '/').replace(':', '/');
                const time = splitDaT[1];
                const timeFrameStarts = new Date(parseInt(timeFrame.startTime));
                const timeFrameEnds = new Date(parseInt(timeFrame.endTime));
                const imgTakenAt = new Date(date + ' ' + time);
                imgTakenAt.setFullYear(timeFrameStarts.getFullYear());
                imgTakenAt.setMonth(timeFrameStarts.getMonth());
                imgTakenAt.setDate(timeFrameStarts.getDate());
                if (
                  imgTakenAt >= timeFrameStarts &&
                  imgTakenAt < timeFrameEnds
                ) {
                  subfolder = timeFrame.name;
                } else {
                  subfolder = 'other';
                }
              } else {
                subfolder = 'other';
              }
            });
          } catch (err) {
            console.error(err);
          }
        }

        if (subfolder) {
          const uuid = randomUUID();
          s3.headObject(
            { Bucket: bucketName, Key: subfolder + '/' },
            (err, data) => {
              if (err) {
                console.log(err['$metadata'].httpStatusCode);
                if (err['$metadata'].httpStatusCode == 404) {
                  s3.putObject(
                    { Bucket: bucketName, Key: subfolder + '/' },
                    (err, data) => {
                      if (err) {
                        console.error(err);
                      } else {
                        console.log(
                          `Folder created successfully. Folder name: ${folderName}`
                        );
                        // Upload file to the newly created folder
                        uploadFileToS3();
                      }
                    }
                  );
                } else {
                  console.error(err);
                }
              } else {
                uploadFileToS3();

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
          const uploadFileToS3 = async () => {
            console.log(img.data);
            const params = {
              Bucket: bucketName,
              Key: `${subfolder}/${uuid + '.' + fileType.ext}`,
              Body: img.data,
              ContentType: `image/${fileType.ext}`,
            };
            try {
              await new Upload({
                client: s3,
                params,
              })
                .done()
                .then((data) => {
                  console.log(
                    `File uploaded successfully. File location: ${data.Location}`
                  );
                });
            } catch (err) {
              console.error(err);
            }
          };
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
  imageGetter();
  console.log(`We're up!`);
  setInterval(imageGetter, 120000);
});
