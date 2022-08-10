// https://artistic-herring-cc8.notion.site/CLI-Telegram-Console-Sender-5acb2178578b4412bf8e32a458b80efb

import TelegramBot from 'node-telegram-bot-api';
import { Command } from 'commander';
import dotenv from 'dotenv';

dotenv.config();
const program = new Command();
//create .env file with token and chat id
const { TG_TOKEN, CHAT_ID } = process.env;
const bot = new TelegramBot(TG_TOKEN, { polling: true });
const [command, value] = process.argv.slice(2);

program.version('0.0.1');
program
	.command('message <message>')
	.description('Send message to telegram bot')
	.alias('m')
	.action(async (message) => {
		await bot.sendMessage(CHAT_ID, message);
		process.exit();
	});
program
	.command('photo <path_to_photo>')
	.description('Send photo to telegram bot')
	.alias('p')
	.action(async (path_to_photo) => {
		await bot.sendPhoto(CHAT_ID, path_to_photo);
		process.exit();
	});

program.parse(process.argv);
