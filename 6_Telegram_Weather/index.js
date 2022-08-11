// https://artistic-herring-cc8.notion.site/TelegramBot-445ab86e8ca44b0a9b5c90043eb991df

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import axios from 'axios';
import { DateTime } from 'luxon';

dotenv.config();
//create .env file with token and chat id
const { TG_TOKEN, OPEN_WEATHER_API_KEY } = process.env;
const bot = new TelegramBot(TG_TOKEN, { polling: true });
bot.on('message', async (msg) => {
	const weatherDp = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
		params: {
			q: 'Dnipro',
			appid: OPEN_WEATHER_API_KEY,
			lang: 'ru',
			units: 'metric',
		},
	});
	const weatherZp = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
		params: {
			q: 'Zaporizhia',
			appid: OPEN_WEATHER_API_KEY,
			lang: 'ru',
			units: 'metric',
		},
	});
	let weatherMessage = '';
	switch (msg.text) {
		case '/start':
			await bot.sendMessage(msg.chat.id, 'Привет, я погодный бот', {
				reply_markup: {
					keyboard: [['Прогноз погоды Днепр'], ['Прогноз погоды Запорожье']],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
			break;
		case 'Прогноз погоды Днепр':
			await bot.sendMessage(msg.chat.id, 'Погода в Днепре', {
				reply_markup: {
					keyboard: [
						['Днепр с интервалом 3 часа', 'Днепр с интервалом 6 часов'],
						['Главное меню'],
					],
					resize_keyboard: true,
					one_time_keyboard: false,
				},
			});
			break;
		case 'Днепр с интервалом 3 часа':
			weatherMessage = ['Погода в Днепре:\n', ...formatDate(weatherDp)];
			await bot.sendMessage(msg.chat.id, weatherMessage.join('\n'), {
				reply_markup: {
					keyboard: [
						['Днепр с интервалом 3 часа', 'Днепр с интервалом 6 часов'],
						['Главное меню'],
					],
					resize_keyboard: true,
				},
			});
			break;
		case 'Днепр с интервалом 6 часов':
			weatherMessage = ['Погода в Днепре:\n', ...formatDate(weatherDp, true)];
			await bot.sendMessage(msg.chat.id, weatherMessage.join('\n'), {
				reply_markup: {
					keyboard: [
						['Днепр с интервалом 3 часа', 'Днепр с интервалом 6 часов'],
						['Главное меню'],
					],
					resize_keyboard: true,
				},
			});
			break;
		case 'Прогноз погоды Запорожье':
			await bot.sendMessage(msg.chat.id, 'Погода в Запорожье', {
				reply_markup: {
					keyboard: [
						['Запорожье с интервалом 3 часа', 'Запорожье с интервалом 6 часов'],
						['Главное меню'],
					],
					resize_keyboard: true,
					one_time_keyboard: false,
				},
			});
			break;
		case 'Запорожье с интервалом 3 часа':
			weatherMessage = ['Погода в Запорожье:\n', ...formatDate(weatherZp)];
			await bot.sendMessage(msg.chat.id, weatherMessage.join('\n'), {
				reply_markup: {
					keyboard: [
						['Запорожье с интервалом 3 часа', 'Запорожье с интервалом 6 часов'],
						['Главное меню'],
					],
					resize_keyboard: true,
				},
			});
			break;
		case 'Запорожье с интервалом 6 часов':
			weatherMessage = ['Погода в Запорожье:\n', ...formatDate(weatherZp, true)];
			await bot.sendMessage(msg.chat.id, weatherMessage.join('\n'), {
				reply_markup: {
					keyboard: [
						['Запорожье с интервалом 3 часа', 'Запорожье с интервалом 6 часов'],
						['Главное меню'],
					],
					resize_keyboard: true,
				},
			});
			break;

		case 'Главное меню':
			await bot.sendMessage(msg.chat.id, 'Выберите город', {
				reply_markup: {
					keyboard: [['Прогноз погоды Днепр'], ['Прогноз погоды Запорожье']],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
			break;
	}
});

const formatDate = (weather, skipEven = false) => {
	let result = {};
	weather.data.list.forEach((item) => {
		const date = DateTime.fromMillis(item.dt * 1000).setLocale('ru');
		const weekday = date.weekdayLong;
		const time = date.toFormat('HH:mm');
		if (result[weekday] === undefined) {
			result[weekday] = [];
		}
		result[weekday].push(
			`\t\t${time}, ${tempFormat(item.main.temp)}, ощущается: ${tempFormat(
				item.main.feels_like,
			)}, ${item.weather[0].description}`,
		);
	});
	result = Object.keys(result)
		.map((key) => [
			key,
			skipEven ? result[key].filter((item, index) => index % 2 === 0) : result[key],
			'\n',
		])
		.flat(2);
	console.log(result);
	return result;
};

const tempFormat = (temp) => {
	if (temp < 0) {
		return `-${temp}°C`;
	}
	return `+${temp}°C`;
};
