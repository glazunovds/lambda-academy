// https://artistic-herring-cc8.notion.site/CLI-Primitive-DB-4b914a94db9c4b0285112b2299528dea

import inquirer from 'inquirer';
import fs from 'fs';

const FILENAME = 'db.txt';

const addUser = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'user_name',
				message: `Enter user's name. To cansel press ENTER`,
			},
		])
		.then((answers) => {
			if (answers.user_name) {
				userQuestions(answers.user_name);
			} else {
				showUsers();
				inquirer
					.prompt([
						{
							type: 'confirm',
							name: 'confirm',
							message: 'Do you want to search another user?',
						},
					])
					.then((answers) => {
						if (answers.confirm) {
							searchUser();
						} else {
							console.log('Goodbye');
						}
					});
			}
		});
};

const showUsers = () => {
	fs.readFile(FILENAME, 'utf8', (err, data) => {
		if (err) {
			console.log(err);
			return;
		}
		try {
			console.log(JSON.parse(data));
		} catch (e) {
			console.log('There are no users found');
			fs.writeFile(FILENAME, JSON.stringify([]), (err) => {
				if (err) {
					console.log(err);
					return;
				}
			});
		}
	});
};

const searchUser = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'user_name',
				message: `Enter user's name. To cansel press ENTER`,
			},
		])
		.then((answers) => {
			if (answers.user_name) {
				fs.readFile(FILENAME, 'utf8', (err, data) => {
					if (err) {
						console.log(err);
						return;
					}
					const searchedUser = JSON.parse(data).find(
						(user) => user.username.toLowerCase() === answers.user_name.toLowerCase(),
					);
					if (searchedUser) {
						console.log(searchedUser);
					} else {
						console.log('User not found');
					}
				});
			}
		});
};

const userQuestions = (username) => {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'gender_list',
				message: 'Choose your gender',
				choices: [
					{
						name: 'Male',
						value: 'male',
					},
					{
						name: 'Female',
						value: 'female',
					},
					{
						name: 'I Sexually Identify as an Attack Helicopter',
						value: 'helicopter',
					},
				],
			},
			{
				type: 'number',
				name: 'age',
				message: 'Enter your age',
			},
		])
		.then((answers) => {
			fs.readFile(FILENAME, { encoding: 'utf8' }, (err, data) => {
				console.log(data);
				fs.writeFile(
					FILENAME,
					JSON.stringify([
						...JSON.parse(data),
						Object.assign(answers, { username: username }),
					]),
					(err) => {
						if (err) {
							console.log(err);
						}
						addUser();
						console.log('user questipns add user');
					},
				);
			});
		});
};

addUser();
