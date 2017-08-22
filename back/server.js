// Init express and execute
const express = require('express');
const app = express();

// Init 'http' and run server
const http = require('http');
const server = http.Server(app);

// Init socket.io and piggyback 'io' based on 'server'
const socket = require('socket.io');
const io = socket(server);

// Init bodyParser
const bodyParser = require('body-parser');

var port = process.env.PORT || 3100;

// ------------------------------------------------- //

// MIDDLEWARE, make sure it's at the top of the server
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// ------------------------------------------------- //

// This array will hold each 'room' that is initialized,
//  and that room object will also have a 'players' array
//  that contains every player that connects into the room
let rooms = [];
let categories = [
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
	`Why I Was Late`, `Why I Was Sent Home from School`,
	`With My Super Power...`,
	`My Gift From Santa`,
	`What I Saved from my Burning House`,
	`How I Escaped Prison`,
	`How I Saved the World`,
	`How I Solved World Hunger`
]
let letterFrequencies = {
	// Taken from https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_the_first_letters_of_a_word_in_the_English_language
	//  on August 21, 2017
	// Total: 100,000
	'a': 11682,
	'b': 4434,
	'c': 5238,
	'd': 3174,
	'e': 2799,
	'f': 4027,
	'g': 1642,
	'h': 4200,
	'i': 7294,
	'j': 511,
	'k': 456,
	'l': 2415,
	'm': 3826,
	'n': 2284,
	'o': 7631,
	'p': 4319,
	'q': 222,
	'r': 2826,
	's': 6686,
	't': 15978,
	'u': 1183,
	'v': 824,
	'w': 5497,
	'x': 45,
	'y': 763,
	'z': 44,
}

// Setting up the '/' endpoint
app.get('/', (req, res) => {
	res.sendStatus(202);
});

// When a room is going to be made, check if that roomCode is
//  valid -- if it doesn't already exist in the 'rooms' array
app.get('/make/:roomCode', (req, res) => {

	// Variables to check if a room already exists
	let roomCode = req.params.roomCode;
	let roomExists = false;

	// Check with the 'rooms' object to see if
	//  a room already exists with the passed-in
	//  'roomCode' param
	for (let i = 0; i < rooms.length; i++) {
		if (rooms[i].roomCode === roomCode) {
			roomExists = true;
		}
	}

	// If a room already exists, return a 400 error so that another
	//  request can be made to return a valid room code
	if (roomExists) {
		res.sendStatus(400);
	}
	else {
		res.sendStatus(202);
	}
});

app.get('/categories', (req, res) => {
	res.send(categories);
});

app.get('/letterfreqs', (req, res) => {
	res.send(letterFrequencies);
})

// Defining what happens on a successful server+io connection
io.on('connection', socket => {

	// When a connection is successfully established...
	console.log(`>> A user has connected! (${socket.id})`);

	// When the host has successfully made a new, unique room,
	//  have that socket 'join' the room. Also add a new entry to
	//  the 'rooms' array that contains the room information
	socket.on('host:make-room', room => {
		console.log(`>> [${room}] host:make-room`);
		socket.join(room);
		rooms.push({ 'roomCode': room, 'host': socket.id, 'players': [] });
	});

	// When the host presses the 'start game' button,
	//  contact all of the players in the room and show them a different message
	socket.on('host:game-intro-starting', roomCode => {
		console.log(`>> [${roomCode}] host:game-intro-starting:`);
		socket.to(roomCode).emit('host:game-intro-starting');
	})

	socket.on('host:round-start', (roomCode, judgeSocketID, judgeName, categoryChoices) => {
		console.log(`>> [${roomCode}] host:round-start: judge:${judgeName} (${judgeSocketID}), ${JSON.stringify(categoryChoices)}`);
		socket.to(roomCode).emit('host:round-start', judgeSocketID, judgeName, categoryChoices);
	});

	// When a player attempts to join a room...
	socket.on('player:join-room', data => {
		console.log(`>> [${data.roomCode}] player:join-room: (pending)`);

		// Loop through all of the 'created' rooms and check if any matches
		//  what was entered by the player
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].roomCode === data.roomCode) {
				console.log(`>> [${data.roomCode}] player:join-room: (success)`);

				// Record the player's socket so it can be passed through
				const playerSocket = socket.id;

				// Successful connection into the room
				// Add the player to the socket room + add their name to the
				//  'rooms' array, with their relevant information
				socket.join(data.roomCode);
				rooms[i].players.push({ 'name': data.name, 'socket': playerSocket });

				// Make a new object variable and add the newSocket into it
				//  I previously tried to pass the socket straight into the 'data'
				//  via the previous socket caller, but it didn't work for some reason
				let newData = data;
				newData.socket = playerSocket;

				// Send to only the host of that room that a player has joined the game,
				//  including the data about who it was that joined
				socket.to(rooms[i].host).emit('host:join-room-success', newData);
			}
		}
	});

	// When the judge selects a category...
	socket.on('judge:select-category', (roomCode, category) => {
		console.log(`>> [${roomCode}] judge:select-category: ${category}`)
		io.to(roomCode).emit('judge:select-category', category);
	})

	socket.on('host:generate-backronym', (roomCode, backronym) => {
		console.log(`>> [${roomCode}] host:generate-backronym: ${backronym}`)
		socket.to(roomCode).emit('host:generate-backronym', backronym);
	})
});

// Init server on *:3100
server.listen(port, () => {
	console.log('Serving on ' + port);
	console.log('Press CTRL+C to abort...')
});