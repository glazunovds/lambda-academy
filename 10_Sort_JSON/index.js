// https://artistic-herring-cc8.notion.site/JSON-255d323c8140453d8fea0b473c1f1488

import axios from 'axios';

const endpoints = [
	'https://jsonbase.com/lambdajson_type1/793',
	'https://jsonbase.com/lambdajson_type1/955',
	'https://jsonbase.com/lambdajson_type1/231',
	'https://jsonbase.com/lambdajson_type1/931',
	'https://jsonbase.com/lambdajson_type1/93',
	'https://jsonbase.com/lambdajson_type2/342',
	'https://jsonbase.com/lambdajson_type2/770',
	'https://jsonbase.com/lambdajson_type2/491',
	'https://jsonbase.com/lambdajson_type2/281',
	'https://jsonbase.com/lambdajson_type2/718',
	'https://jsonbase.com/lambdajson_type3/310',
	'https://jsonbase.com/lambdajson_type3/806',
	'https://jsonbase.com/lambdajson_type3/469',
	'https://jsonbase.com/lambdajson_type3/258',
	'https://jsonbase.com/lambdajson_type3/516',
	'https://jsonbase.com/lambdajson_type4/79',
	'https://jsonbase.com/lambdajson_type4/706',
	'https://jsonbase.com/lambdajson_type4/521',
	'https://jsonbase.com/lambdajson_type4/350',
	'https://jsonbase.com/lambdajson_type4/64',
];

const getPropertyFromObject = (obj, property) => {
	const variables = [];
	JSON.stringify(obj, (key, val) => {
		if (key === property) {
			variables.push(val);
		}
		return val;
	});
	if (variables.length > 0) {
		return variables[0];
	}
	return null;
};

const processEndpoints = async () => {
	let trueIsDone = [];
	let falseIsDone = [];
	for (let i = 0; i < endpoints.length; i++) {
		const endpoint = endpoints[i];
		const response = await retry(axios.get(endpoint), endpoint);
		if (response) {
			const isDone = getPropertyFromObject(response.data, 'isDone');
			if (isDone) {
				trueIsDone.push(endpoint);
			} else {
				falseIsDone.push(endpoint);
			}
			console.log(`${endpoint}: isDone: ${isDone}`);
		} else {
			console.log(`${endpoint} failed`);
		}
	}

	console.log(`Значений True для isDone -> ${trueIsDone.length}`);
	console.log(`Значений False для isDone -> ${falseIsDone.length}`);
};

//retry axios promise if it fails 3 times, then reject
const retry = async (promise, endpoint, retries = 0) => {
	try {
		return await promise;
	} catch (error) {
		if (retries < 3) {
			console.log(`${endpoint} failed, retrying...`);
			return retry(promise, endpoint, retries + 1);
		}
	}
};

await processEndpoints();
