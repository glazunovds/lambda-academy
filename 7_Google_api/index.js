import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import inquirer from 'inquirer';
import axios from 'axios';

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
	if (err) return console.log('Error loading client secret file:', err);
	authorize(JSON.parse(content), initialDialog);
});

const inquirerShortenDailog = (link) => {
	inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'shortenLink',
				message: 'Do you want to shorten link?',
			},
		])
		.then(async (answers) => {
			if (answers.shortenLink) {
				const newLink = await shortenLink(link);
				console.log(`Shortened link: ${newLink.data}`);
			}
		});
};

const shortenLink = async (link) => {
	const url = 'https://tinyurl.com/api-create.php?url=';
	const options = {
		url: url + link,
		method: 'GET',
	};
	return axios(options);
};

const initialDialog = (auth) => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'filePath',
				message: 'Drag and drop the file you want to upload',
			},
		])
		.then((answers) => {
			const filePath = answers.filePath;
			const fileName = filePath.split('/').pop();
			const fileExtension = fileName.split('.').pop();
			console.log(`Path to file: ${filePath}`);
			console.log(`File name: ${fileName}`);
			console.log(`File extension: ${fileExtension}`);
			inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'confirmName',
						message: `You're uploading file with name ${fileName}. Would you like to change it?`,
					},
				])
				.then((answers) => {
					if (answers.confirmName) {
						inquirer
							.prompt([
								{
									type: 'input',
									name: 'newFileName',
									message: 'Enter new file name without extension',
								},
							])
							.then((answers) => {
								const newFileName = answers.newFileName;
								uploadFile(filePath, newFileName, auth);
							});
					} else {
						uploadFile(filePath, fileName, auth);
					}
				});
		})
		.catch((err) => {
			console.log(err);
		});
};

const authorize = (credentials, callback) => {
	const { client_secret, client_id, redirect_uris } = credentials.web;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
};
const getAccessToken = (oAuth2Client, callback) => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
};

const uploadFile = (filePath, fileName, auth) => {
	fs.readFile(filePath, (err, content) => {
		if (err) {
			console.log(`Error reading file: ${err}`);
			return;
		}
		const drive = google.drive({ version: 'v3', auth });
		drive.files.create(
			{
				resource: {
					name: fileName,
					mimeType: 'application/octet-stream',
				},
				media: {
					mimeType: 'application/octet-stream',
					body: fs.createReadStream(filePath),
				},
			},
			(err, res) => {
				if (err) {
					console.log(`Error creating file: ${err}`);
					return;
				}
				console.log(`File ${fileName} uploaded successfully`);
				const link = `https://drive.google.com/file/d/${res.data.id}/view`;
				console.log(`Link: ${link}`);
				inquirerShortenDailog(link);
			},
		);
	});
};
