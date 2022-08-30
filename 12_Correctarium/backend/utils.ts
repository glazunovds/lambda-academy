import { DateTime } from 'luxon';

export const calculateCost = (symbolsCount, fileExtension, language) => {
	const pricePerSign = {
		ua: 0.05,
		ru: 0.05,
		en: 0.12,
	};

	const minPrice = {
		ua: 50,
		ru: 50,
		en: 120,
	};

	const price = symbolsCount * pricePerSign[language];
	const minPriceValue = minPrice[language];
	let finalPrice = price > minPriceValue ? price : minPriceValue;
	if (fileExtension !== 'doc' && fileExtension !== 'docx' && fileExtension !== 'rtf') {
		finalPrice *= 1.2;
	}
	return +finalPrice.toFixed(2);
};

export const calculateTime = (symbolsCount, fileExtension, language) => {
	const timePerSign = {
		ua: 1333,
		ru: 1333,
		en: 333,
	};

	const minTime = {
		ua: 1,
		ru: 1,
		en: 1,
	};

	const time = symbolsCount / timePerSign[language];
	const minTimeValue = minTime[language];
	let finalTime = time > minTimeValue ? time + 0.5 : minTimeValue;
	if (fileExtension !== 'doc' && fileExtension !== 'docx' && fileExtension !== 'rtf') {
		finalTime *= 1.2;
	}
	return Math.ceil(finalTime);
};

export const calculateDeadline = (estimationHours: number): DateTime => {
	const estimationMinutes = estimationHours * 60;
	let startDate = DateTime.now();
	let monday = startDate.startOf('week').set({ hour: 10 });
	const offset = startDate.diff(monday, ['days', 'hours', 'minutes']);
	startDate = monday;
	const workMinutesPerHour = 60;
	const workMinutesPerDay = workMinutesPerHour * (19 - 10);
	const workMinutesPerWeek = workMinutesPerDay * 5;
	let deadlineTotalMinutes =
		estimationMinutes +
		Math.min(
			workMinutesPerWeek,
			offset.days * workMinutesPerDay + offset.hours * workMinutesPerHour + offset.minutes,
		);
	const deadlineWeeks = Math.floor(deadlineTotalMinutes / workMinutesPerWeek);
	deadlineTotalMinutes -= deadlineWeeks * workMinutesPerWeek;
	const deadlineDays = Math.floor(deadlineTotalMinutes / workMinutesPerDay);
	deadlineTotalMinutes -= deadlineDays * workMinutesPerDay;
	const deadlineHours = Math.floor(deadlineTotalMinutes / workMinutesPerHour);
	const deadlineMinutes = deadlineTotalMinutes % workMinutesPerHour;
	return startDate.plus({
		weeks: deadlineWeeks,
		days: deadlineDays,
		hours: deadlineHours,
		minutes: deadlineMinutes,
	});
};
