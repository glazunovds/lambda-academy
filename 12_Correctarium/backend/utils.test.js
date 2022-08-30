const calculateCost = require('./utils.js').calculateCost;
const calculateTime = require('./utils.js').calculateTime;

test('1 symbol with ua language and .doc format costs 50 uah', () => {
	expect(calculateCost(1, 'doc', 'ua')).toBe(50);
});

test('1 symbol with ru language and .doc format costs 50 uah', () => {
	expect(calculateCost(1, 'doc', 'ru')).toBe(50);
});

test('1 symbol with en language and .doc format costs 120 uah', () => {
	expect(calculateCost(1, 'doc', 'en')).toBe(120);
});

test('1 symbol with ua language and .docx format costs 50 uah', () => {
	expect(calculateCost(1, 'docx', 'ua')).toBe(50);
});

test('1 symbol with ru language and .docx format costs 50 uah', () => {
	expect(calculateCost(1, 'docx', 'ru')).toBe(50);
});

test('1 symbol with en language and .docx format costs 120 uah', () => {
	expect(calculateCost(1, 'docx', 'en')).toBe(120);
});

test('1 symbol with ua language and .rtf format costs 50 uah', () => {
	expect(calculateCost(1, 'rtf', 'ua')).toBe(50);
});

test('1 symbol with ru language and .rtf format costs 50 uah', () => {
	expect(calculateCost(1, 'rtf', 'ru')).toBe(50);
});

test('1 symbol with en language and .rtf format costs 120 uah', () => {
	expect(calculateCost(1, 'rtf', 'en')).toBe(120);
});

test('1001 symbols with ua language and .doc format costs 50.05 uah', () => {
	expect(calculateCost(1001, 'doc', 'ua')).toBe(50.05);
});

test('1001 symbols with ru language and .doc format costs 50.05 uah', () => {
	expect(calculateCost(1001, 'doc', 'ru')).toBe(50.05);
});

test('1001 symbols with en language and .doc format costs 120.12 uah', () => {
	expect(calculateCost(1001, 'doc', 'en')).toBe(120.12);
});

test('1 symbol with ua language and .pdf format costs 60 uah', () => {
	expect(calculateCost(1, 'pdf', 'ua')).toBe(60);
});

test('1 symbol with ru language and .pdf format costs 60 uah', () => {
	expect(calculateCost(1, 'pdf', 'ru')).toBe(60);
});

test('1 symbol with en language and .pdf format costs 144 uah', () => {
	expect(calculateCost(1, 'pdf', 'en')).toBe(144);
});

test('1001 symbol with ua language and .pdf format costs 60.06 uah', () => {
	expect(calculateCost(1001, 'pdf', 'ua')).toBe(60.06);
});

test('1001 symbol with ru language and .pdf format costs 60.06 uah', () => {
	expect(calculateCost(1001, 'pdf', 'ru')).toBe(60.06);
});

test('1001 symbol with en language and .pdf format costs 144.144 uah', () => {
	expect(calculateCost(1001, 'pdf', 'en')).toBe(144.14);
});

test('1 symbol with ua language and .doc format spends 1 hour', () => {
	expect(calculateTime(1, 'doc', 'ua')).toBe(1);
});

test('1 symbol with ru language and .doc format spends 1 hour', () => {
	expect(calculateTime(1, 'doc', 'ru')).toBe(1);
});

test('1 symbol with en language and .doc format spends 1 hour', () => {
	expect(calculateTime(1, 'doc', 'en')).toBe(1);
});

test('2000 symbol with ua language and .doc format spends 2 hours', () => {
	expect(calculateTime(2000, 'doc', 'ua')).toBe(3);
});

test('3000 symbol with ua language and .txt format spends 2 hours', () => {
	expect(calculateTime(3000, 'txt', 'ua')).toBe(4);
});

test('2700 symbol with ua language and .txt format spends 2 hours', () => {
	expect(calculateTime(2700, 'txt', 'ua')).toBe(4);
});

test('2000 symbol with en language and .txt format spends 8 hours', () => {
	expect(calculateTime(2000, 'txt', 'en')).toBe(8);
});

test('2000 symbol with en language and .doc format spends 6 hours', () => {
	expect(calculateTime(2000, 'txt', 'en')).toBe(8);
});
