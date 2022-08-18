const fs = require('fs');

const uniqueValues = () => {
	let time = new Date().getTime();
	const res = generateMap();
	let time2 = new Date().getTime();
	const uniqueValues = [...res.values()].filter((word) => word.files.length === 1);

	console.log(`Unique values: ${uniqueValues.length}, time: ${(time2 - time) / 1000} s.`);
	fs.writeFileSync('uniqueWords.txt', uniqueValues.map((word) => word.word).join('\n'));
};

const binarySearch = (arr, value) => {
	let low = 0;
	let high = arr.length - 1;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		if (arr[mid] === value) {
			return mid;
		}
		if (arr[mid] < value) {
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}
	return -1;
};

const wordExistInAllFiles = () => {
	const time = new Date().getTime();
	const res = generateMap();
	const wordsExistInAllFiles = [...res.values()].filter((word) => word.files.length === 20);
	const time2 = new Date().getTime();
	console.log(
		`Words exist in all files: ${wordsExistInAllFiles.length}, time: ${
			(time2 - time) / 1000
		} s.`,
	);
	fs.writeFileSync(
		'wordsExistInAllFiles.txt',
		wordsExistInAllFiles.map((word) => word.word).join('\n'),
	);
};

const existInAtLeastTen = () => {
	const time = new Date().getTime();
	const res = generateMap();
	const wordsExistInAtLeastTen = [...res.values()].filter((word) => word.files.length >= 10);
	const time2 = new Date().getTime();
	console.log(
		`Words exist in at least ten files: ${wordsExistInAtLeastTen.length}, time: ${
			(time2 - time) / 1000
		} s.`,
	);
	fs.writeFileSync(
		'wordsExistInAtLeastTen.txt',
		wordsExistInAtLeastTen.map((word) => word.word).join('\n'),
	);
};

const generateMap = () => {
	const files = fs.readdirSync('./2kk_words_400x400');
	const map = new Map();
	files.forEach((file) => {
		const words = fs.readFileSync(`./2kk_words_400x400/${file}`, 'utf8').split('\n');
		words.forEach((word) => {
			if (map.has(word)) {
				const wordObj = map.get(word);
				map.set(word, {
					word,
					files: [...new Set(wordObj.files), file],
					count: wordObj.count + 1,
				});
			} else {
				map.set(word, {
					word,
					files: [file],
					count: 1,
				});
			}
		});
	});
	return map;
};

uniqueValues();
wordExistInAllFiles();
existInAtLeastTen();
