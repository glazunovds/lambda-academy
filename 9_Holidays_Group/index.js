// https://artistic-herring-cc8.notion.site/92d7bf32e1024c7293210cce4b9f21f8

import fs from 'fs';

const holidays = fs.readFileSync('holidays.json', 'utf8');
const holidaysObj = JSON.parse(holidays);

const groupHolidaysByUser = (holidays) => {
	const holidaysByUser = {};
	holidays.forEach((holiday) => {
		const userId = holiday.user._id;
		const userName = holiday.user.name;
		const startDate = holiday.startDate;
		const endDate = holiday.endDate;
		if (!holidaysByUser[userId]) {
			holidaysByUser[userId] = {
				userId,
				name: userName,
				weekendDays: [],
			};
		}
		holidaysByUser[userId].weekendDays.push({ startDate, endDate });
	});
	return Object.values(holidaysByUser);
};

const holidaysGroupedByUser = groupHolidaysByUser(holidaysObj);
fs.writeFileSync('holidaysGroupedByUser.json', JSON.stringify(holidaysGroupedByUser));
console.log(holidaysGroupedByUser);
