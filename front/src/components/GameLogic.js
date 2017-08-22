// Host Methods
let startGame = (time, players) => {
	// Select judge function to figure out who the judge is.
	//  Everyone else will be selected as players.
	function selectJudge() {
		// Selecting the judge
		return (players[Math.floor(Math.random() * players.length)]);
	}
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			resolve(
				// Selecting the judge for the round
				selectJudge()
			);
		}, time);
	})
}

let startRoundTimer = () => {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {

			console.log('gamelogic.startRoundTimer!')

			resolve(
				'hurray!'
			);
		}, 5000);
	})
}

let generateBackronym = (lf) => {
	let backronym = [];

	// Determine how many letters the backronym will be
	let len = Math.floor(Math.random() * 3) + 3;

	// Determine what letters the backronym will start with
	for (let i = 0; i < len; i++) {
		let rand = Math.floor(Math.random() * 100000) + 1;
		let tally = 0;
		let letter = 's'; // s by default

		// console.log(rand);

		Object.keys(lf).forEach(key => {

			// console.log(key);          // the name of the current key.
			// console.log(lf[key]);   // the value of the current key.

			if (rand > tally && rand <= lf[key]+tally){
				backronym.push(key);
			}
			tally += lf[key];
		});
	}
	return backronym.join('');
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
	startGame: startGame,
	shuffleCategories: shuffleCategories,
	presentCategoryChoices: presentCategoryChoices,
	generateBackronym: generateBackronym,
	startRoundTimer: startRoundTimer
}

export default GameLogicObj;