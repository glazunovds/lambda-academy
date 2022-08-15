// https://artistic-herring-cc8.notion.site/TelegramBot-96dc96659b3a4005a5673b92cadd34cd

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import axios from 'axios';
import { DateTime } from 'luxon';

dotenv.config();
//create .env file with token and chat id
const { TG_TOKEN, OPEN_WEATHER_API_KEY } = process.env;
const bot = new TelegramBot(TG_TOKEN, { polling: true });
let monoCurrencyStore = [];
let lastUpdated = 0;
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
	let currencyMsg = '';
	switch (msg.text) {
		case '/start':
			await bot.sendMessage(msg.chat.id, 'Привет, я погодно/валютный бот', {
				reply_markup: {
					keyboard: [['Погода'], ['Валюта']],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
			break;
		case 'Погода':
			await bot.sendMessage(msg.chat.id, 'Выберите город', {
				reply_markup: {
					keyboard: [['Днепр', 'Запорожье'], ['Главное меню']],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
			break;

		case 'Днепр':
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
		case 'Запорожье':
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
		case 'Валюта':
			await bot.sendMessage(msg.chat.id, 'Выберите валюту', {
				reply_markup: {
					keyboard: [['Доллары', 'Евро'], ['Главное меню']],
					resize_keyboard: true,
					one_time_keyboard: false,
				},
			});
			break;
		case 'Доллары':
			currencyMsg = await getCurrencyMessage('USD');
			await bot.sendMessage(msg.chat.id, currencyMsg, {
				reply_markup: {
					keyboard: [['Доллары', 'Евро'], ['Главное меню']],
					resize_keyboard: true,
					one_time_keyboard: false,
				},
			});
			break;
		case 'Евро':
			currencyMsg = await getCurrencyMessage('EUR');
			await bot.sendMessage(msg.chat.id, currencyMsg, {
				reply_markup: {
					keyboard: [['Доллары', 'Евро'], ['Главное меню']],
					resize_keyboard: true,
					one_time_keyboard: false,
				},
			});
			break;

		case 'Главное меню':
			await bot.sendMessage(msg.chat.id, 'Выберите действие', {
				reply_markup: {
					keyboard: [['Погода'], ['Валюта']],
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
	return result;
};

const tempFormat = (temp) => {
	if (temp < 0) {
		return `-${temp}°C`;
	}
	return `+${temp}°C`;
};

const getCurrencyMessage = async (currency) => {
	let resultMessage = '';
	const currencyCode = currency === 'USD' ? 840 : 978;
	const currencyText = currency === 'USD' ? 'доллара' : 'евро';
	const date = new Date().getTime();
	const monoCurrency = await axios
		.get('https://api.monobank.ua/bank/currency')
		.then((res) => {
			monoCurrencyStore = res.data;
			lastUpdated = date;
		})
		.catch((err) => {
			resultMessage = `Ошибка при получении данных о валюте из монобанка, последнее обновление было в ${DateTime.fromMillis(
				lastUpdated,
			).toLocaleString(DateTime.DATETIME_SHORT)}\n\n`;
		});
	const privatCashCourse = await axios.get(
		'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5',
	);
	const privatCardCourse = await axios.get(
		'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11',
	);
	return Promise.all([monoCurrencyStore, privatCashCourse, privatCardCourse]).then(
		async ([monoCurrency, privatCashCourse, privatCardCourse]) => {
			const privatCash = privatCashCourse.data.find((item) => item.ccy === currency);
			const privatCard = privatCardCourse.data.find((item) => item.ccy === currency);
			if (monoCurrency.length > 0) {
				const monoCurrencyRate = monoCurrency.find(
					(item) => item.currencyCodeA === currencyCode,
				);
				resultMessage += `Курс ${currencyText} в Монобанке:
							Покупка: ${monoCurrencyRate.rateBuy} грн.
							Продажа: ${monoCurrencyRate.rateSell} грн.
					\n\n`;
			}
			resultMessage += `Курс ${currencyText} в Приватбанке:
				Карточный курс: 
							покупка - ${privatCard.buy} грн,
							продажа - ${privatCard.sale} грн.
				Наличный курс: 
							покупка - ${privatCash.buy} грн,
							продажа - ${privatCash.sale} грн.
			`;
			return resultMessage;
		},
	);
};
