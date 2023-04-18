import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import cloudinary from 'cloudinary';
import axios from 'axios';
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

// cloudinary.v2.config({
//  cloud_name: 'dmjqy7rx4',
//  api_key: '965566542713632',
//  api_secret: 'Lkkt3Vc3cHhneTZbeXJSauIKdAw',
// });

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
const picsCollection = client.db('wedpic').collection('pics');

// app.post('/addTimeFrame', (req, res) => {
//  try {
//    timeFramesCollection.insertOne(req.body);
//    res.send('success');
//  } catch (err) {
//    console.error(err);
//    req.send(err);
//  }
// });

app.get('/getTimeFrames', async (req, res) => {
	try {
		const timeFrames = await timeFramesCollection.find({}).toArray();
		res.send(timeFrames);
	} catch (err) {
		console.error(err);
		req.send(err);
	}
});

app.get('/getImages', async (req, res) => {
	try {
		// const pics = picsCollection.find({}).toArray();
		const pics = [];
		fs.readdir(join(__dirname, '/../uploads'), (err, files) => {
			files.forEach(async (file) => {
				pics.push(await fs.readFile(join(__dirname, '/../uploads', file)));
			});
		});
		console.log(pics);
		res.send(pics);
	} catch (error) {
		res.send(error);
	}
});

app.post('/addImages', (req, res) => {
	try {
		console.log(req.files);
		req.files.files.forEach(async (img) => {
			const fileType = await fileTypeFromBuffer(img.data);
			const uuid = randomUUID();
			img.mv(join(__dirname, '/../uploads', uuid + '.' + fileType.ext), (e) => {
				if (e) console.log(e);
			});
			// await picsCollection.insertOne({ uuid });
			// cloudinary.v2.uploader.upload(img);
		});
		res.send('worked');
	} catch (error) {
		res.status(400).send(error);
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
	setInterval(async () => {
		try {
			const { resources } = await cloudinary.v2.api.resources();
			const currPics = await picsCollection.find({}).toArray();
			const pics = resources.map(({ url }) => {
				return url;
			});
			const picsToSend = [];
			for (pic of pics) {
				if (!currPics.includes(pic)) picsToSend.push(pic);
			}
			if (picsToSend.length != 0)
				await picsCollection.insertMany(
					picsToSend.map((url) => {
						return { url };
					})
				);
		} catch (error) {
			res.send(error);
		}
	}, 3600000);
	console.log(`We're up!`);
});
