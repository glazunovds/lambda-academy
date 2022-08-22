// https://artistic-herring-cc8.notion.site/IP-e0f06ee622a34a8d8d186d1d2ad34a61

import express from 'express';
import fs from 'fs';
import { binarySearch, ip2long } from './utils.js';

const app = express();
const port = process.env.PORT || 80;
const db = fs.readFileSync('IP2LOCATION-LITE-DB1.CSV', 'utf8').split('\n');

const testIps = [
	'45.232.208.143',
	'185.182.120.34',
	'45.177.176.23',
	'5.44.80.51',
	'91.149.48.22',
	'83.229.33.3',
	'203.24.108.65',
	'23.43.23.15',
	'89.28.176.5',
	'77.83.248.211',
];

testIps.forEach((ip) => {
	const ipLong = ip2long(ip);
	const [countryCode, country] = binarySearch(db, ipLong);
	console.log(`${ip} -> ${ipLong} -> ${countryCode} ${country}`);
});

app.get('/test', (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	const date1 = new Date().getTime();
	const [countryCode, country] = binarySearch(db, ip2long(ip));
	const date2 = new Date().getTime();
	console.log(`${ip} -> ${countryCode} ${country} -> ${date2 - date1} ms`);
	res.json({ ip, countryCode, country });
}).listen(port, () => console.log(`Listening on port ${port}`));
