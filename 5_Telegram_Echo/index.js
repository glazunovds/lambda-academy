// https://artistic-herring-cc8.notion.site/CLI-Telegram-Echo-c038f9bb6dca4365abd451fb9a3b392b

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
//create .env file with token and chat id
const { TG_TOKEN, CHAT_ID } = process.env;
const bot = new TelegramBot(TG_TOKEN, { polling: true });
bot.on('message', async (msg) => {
	console.log(`Пользователь ${msg.from.first_name} ${msg.from.last_name} написал: ${msg.text}`);
	if (msg.text === 'photo') {
		const photo = await axios.get('https://picsum.photos/200/300', {
			responseType: 'arraybuffer',
		});
		await bot.sendPhoto(
			CHAT_ID,
			photo.data,
			{
				contentType: 'application/octet-stream',
			},
			(err) => {
				if (err) {
					console.log(err);
				}
			},
		);
	}
});
