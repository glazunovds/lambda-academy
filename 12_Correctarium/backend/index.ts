import express = require('express');
import bodyParser = require('body-parser');
import { Express } from 'express';
import { DateTime } from 'luxon';
import { calculateCost, calculateDeadline, calculateTime } from './utils.js';

const app: Express = express();
//disable cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
const port = process.env.PORT || 80;
const jsonParser = bodyParser.json();

app.post('/calc', jsonParser, (req, res) => {
	if (!req.body) return res.sendStatus(400);
	const { language, mimetype, count } = req.body;
	if (
		typeof language === 'undefined' ||
		typeof mimetype === 'undefined' ||
		typeof count === 'undefined'
	)
		return res.sendStatus(400);
	const cost = calculateCost(count, mimetype, language);
	const time = calculateTime(count, mimetype, language);
	const millis = calculateDeadline(time).toMillis();
	const deadline = DateTime.fromMillis(millis).toFormat('dd.MM.yyyy HH:mm:ss');
	res.json({ price: cost, time, deadline: millis, deadlineDate: deadline });
}).listen(port, () => console.log(`Listening on port ${port}`));
