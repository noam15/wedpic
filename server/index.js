import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import axios from 'axios';
import { google } from 'googleapis';
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
		fs.readdir(join(__dirname, '/../uploads'), (err, files) => {
			files.forEach((file) => {
				pics.push(
					fs
						.readFileSync(join(__dirname, '/../uploads', file))
						.toString('base64')
				);
			});
			res.send(pics);
		});
	} catch (error) {
		res.send(error);
	}
});

app.post('/addImages', (req, res) => {
	try {
		console.log(req.files);
		req.files.files.forEach(async (img) => {
			const fileType = await fileTypeFromBuffer(img.data);
			let subfolder = '';
			new ExifImage({ image: img.data }, (err, metadata) => {
				if (err) console.error(err);
				else {
					timeFramesCollection
						.find({})
						.toArray()
						.forEach((timeFrame) => {
							const dateAndTime = metadata.exif.DateTimeOriginal.split(' ');
							const date = dateAndTime[0].replace(':', '/');
							const time = dateAndTime[1];
							const imgTakenAt = new Date(date + ' ' + time);
							const timeFrameStarts = new Date(timeFrame.startTime);
							const timeFrameEnds = new Date(timeFrame.endTime);
							if (imgTakenAt >= timeFrameStarts && imgTakenAt < timeFrameEnds) {
								subfolder = timeFrame.title;
							}
						});
				}
				if (subfolder) {
					const uuid = randomUUID();
					if (fs.existsSync(join(__dirname, '/../uploads', subfolder))) {
					} else {
						fs.mkdirSync(join(__dirname, '/../uploads', subfolder));
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
		});
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
