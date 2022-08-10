// https://artistic-herring-cc8.notion.site/CLI-Interactive-sort-fd767d630dd64a19ad68097dd25999bc

const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const messageHandler = () => {
	rl.question('Enter words or numbers with space between them: ', (answer) => {
		const arr = answer.split(' ');
		const words = arr.filter((item) => isNaN(item));
		const numbers = arr.filter((item) => !isNaN(item));
		rl.question(
			`What do you like to do with them? (select 1 - 6 and then press ENTER) 
			1. Sort only words by name
			2. Sort only numbers asc
			3. Sort only numbers desc
			4. Sort only words by quantity of letters
			5. Show only unique words
			6. Show unique words or numbers
			
			Type 'exit' to stop.
		`,
			(answer) => {
				switch (answer) {
					case '1':
						console.log(words.sort());
						break;
					case '2':
						console.log(numbers.sort((a, b) => a - b));
						break;
					case '3':
						console.log(numbers.sort((a, b) => b - a));

						break;
					case '4':
						console.log(words.sort((a, b) => a.length - b.length));
						break;
					case '5':
						console.log([...new Set(words)]);
						break;
					case '6':
						console.log([...new Set(words.concat(numbers))]);
						break;
					case 'exit':
						rl.close();
						return;
					default:
						console.log('Wrong answer');
						break;
				}
				messageHandler();
			},
		);
	});
};

messageHandler();
