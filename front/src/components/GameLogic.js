import axios from 'axios';

// Host Methods
// let startGame = (time, players) => {
// 	// Select judge function to figure out who the judge is.
// 	//  Everyone else will be selected as players.
// 	function selectJudge() {
// 		// Selecting the judge
// 		return (players[Math.floor(Math.random() * players.length)]);
// 	}
// 	return new Promise(function (resolve, reject) {
// 		setTimeout(() => {
// 			resolve(
// 				// Selecting the judge for the round
// 				selectJudge()
// 			);
// 		}, time);
// 	})
// }

// LOBBY METHODS
let checkJoinInput = (roomInput, input) => {
	// Checks if a) the roomInput is 4 characters and only consonants
	//  and b) if the nameInput doesn't contain any special characters or spaces
	//  (allowed are numbers, letters, dashes, underscores, periods, but no spaces or otherwise)
	//  c) less than 18 characters total
	if (/^[bcdfghjklmnpqrstvwxyz]{4}$/.test(roomInput) && /^[a-zA-Z0-9_.-]*$/.test(input) && input !== '' && input.length < 18) {
		return true;
	}
	else {
		return false;
	}
}

let checkIfRoomExists = (roomInput) => {
	return new Promise(function (resolve, reject) {
		// axios.get('http://localhost:3100/exists/' + roomInput)
		axios.get('/exists/' + roomInput)
			.then(exists => {
				if (exists.data === true){
					resolve(true);
				}
				else {
					resolve(false);
				}
			})
			.catch(existsFalse => {
				resolve(false);
			});
	})
}

// HOST METHODS

let generateBackronym = (lf) => {
	let backronym = [];

	// Determine how many letters the backronym will be
	let len = Math.floor(Math.random() * 3) + 2;

	// Determine what letters the backronym will start with
	for (let i = 0; i < len; i++) {
		let rand = Math.floor(Math.random() * 100000) + 1;
		let tally = 0;

		// console.log(rand);

		Object.keys(lf).forEach(key => {

			// console.log(key);          // the name of the current key.
			// console.log(lf[key]);   // the value of the current key.

			if (rand > tally && rand <= lf[key] + tally) {
				backronym.push(key);
			}
			tally += lf[key];
		});
	}
	return backronym.join('');
}

let checkBackronym = (backronym, entry, existingSubmission) => {


	// console.log(`backronym: ${backronym}`);
	// console.log(`entry: ${entry}`);

	// Final return boolean
	// let isEntryValid = true;

	// Checking if there's any entry
	if (entry === '') {
		return {
			'valid': false,
			'message': 'please enter a backronym',
			'code': 400
		}
	}

	// Checking if the entry is exactly the same as an old submission
	if (entry === existingSubmission) {
		return {
			'valid': false,
			'code': 300
		}
	}

	// Method to eliminate unnecessary whitespace
	String.prototype.allTrim = String.prototype.allTrim ||
		function () {
			return this.replace(/\s+/g, ' ')
				.replace(/^\s+|\s+$/, '')
				.replace(/\s+$/, '');
		};

	// Split up both the backronym and the entry so it can be assessed
	let backronymSplit = backronym.toLowerCase().split("");
	let entrySplit = entry.toLowerCase().allTrim().split(" ");

	// console.log(`backronymSplit: ${backronymSplit}`);
	// console.log(`entrySplit: ${entrySplit}`);

	if (backronymSplit.length !== entrySplit.length) {
		// console.log('FALSE: not the same amount of words')
		return {
			'valid': false,
			'message': 'invalid backronym submitted, try again',
			'code': 401
		};
	}
	for (let i = 0; i < backronymSplit.length; i++) {
		// Checking if the first letters match
		if (entrySplit[i][0] !== backronymSplit[i]) {
			// console.log('FALSE: first letters don\'t match');
			return {
				'valid': false,
				'message': 'invalid backronym submitted, try again',
				'code': 402
			};
		}
	}

	return {
		'valid': true,
		'entry': entry.allTrim(),
		'code': 200
	};
}

// Player/Judge/Game Methods

// JUDGE
let shuffleCategories = (categories) => {
	let a = categories;
	var i = 0, j = 0, temp = null;

	for (i = a.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1));
		temp = a[i];
		a[i] = a[j];
		a[j] = temp;
	}
	return a;
}

let presentCategoryChoices = (categories, categoryHead) => {
	let categoryChoices = [];
	for (let i = categoryHead; i < (categoryHead + 3); i++) {
		categoryChoices.push(categories[i]);
	}
	return categoryChoices;
}

let GameLogicObj = {
	// startGame: startGame,
	checkJoinInput: checkJoinInput,
	shuffleCategories: shuffleCategories,
	presentCategoryChoices: presentCategoryChoices,
	generateBackronym: generateBackronym,
	checkBackronym: checkBackronym,
	checkIfRoomExists: checkIfRoomExists
	// startRoundTimer: startRoundTimer
}

export default GameLogicObj;