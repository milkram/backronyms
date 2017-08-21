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

// Player Methods
let serveCategories = (time) => {
	let arrayCategories = [
		`And the award for Best Movie goes to...`,
		`If you think that's awesome, you should see my...`,
		`You won't believe what I saw the Judge do yesterday...`,
		`#hashtag`,
		`Baby's First Words`,
		`Back in My Day...`,
		`Before I Go to Bed`,
		`Bucket List Accomplishments`,
		`Cheesy Pick-Up Lines`,
		`Famous Last Words`,
		`Guilty Pleasures`,
		`Halloween Costume of the Year`,
		`How I Became Famous`,
		`How I Escaped Prison`,
		`How I Start the Day`,
		`How the Movie Ended`,
		`How the World Ended`,
		`I Have the World Record for...`,
		`If Elected President, I Would...`,
		`If I Could Turn Back Time...`,
		`Inappropriate Dinner Topics`,
		`Juicy Gossip`,
		`Million Dollar Idea`,
		`My Dream Job`,
		`My First Band Name`,
		`My First Time`,
		`My Gravestone Message`,
		`My Internet History`,
		`My Last Day On Earth`,
		`My One Wish`,
		`My Personal Motto`,
		`New Years Resolutions`,
		`Newspaper Headlines`,
		`Rejected Potato Chip Flavours`,
		`That Cloud Looks Like A...`,
		`The Meaning of Life`,
		`The Next Infomercial Product`,
		`The Next McDonalds© Slogan`,
		`The Next Reality Show`,
		`The Next Viral Video`,
		`The Person Beside You`,
		`The Surprise in My Kinder Surprise©`,
		`What Chuck Norris Would Do`,
		`What I Found in My Food`,
		`What I Found on the Ground`,
		`What My Phone Can Do`,
		`What My Tattoo Would Say`,
		`What Not to Yell in a Public Place`,
		`What the Doctor Prescribed`,
		`What the Pet is Thinking`,
		`When I Win the Lottery`,
		`Where I Would Take the Judge on a Date`,
		`Why I Was Late`,`Why I Was Sent Home from School`,
		`With My Super Power...`,
		`My Gift From Santa`,
		`What I Saved from my Burning House`,
		`How I Escaped Prison`,
		`How I Saved the World`,
		`How I Solved World Hunger`
	];

	function selectCategory() {
		// Selecting a random category
		return (arrayCategories[Math.floor(Math.random() * arrayCategories.length)]);
	}

	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			resolve(
				selectCategory()
			)
		}, time)
	})
}

let GameLogicObj = {
	startGame: startGame,
	serveCategories: serveCategories
}

export default GameLogicObj;