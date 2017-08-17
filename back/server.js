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

// Defining what happens on a successful server+io connection
io.on('connection', socket => {

	// When a connection is successfully established...
	console.log('>> A user has connected! ' + '(' + socket.id + ')');

	// When the host has successfully made a new, unique room,
	//  have that socket 'join' the room. Also add a new entry to
	//  the 'rooms' array that contains the room information
	socket.on('host:make-room', room => {
		console.log('>> host:make-room: ' + room);
		socket.join(room);
		rooms.push({ 'roomCode': room, 'host': socket.id, 'players': [] });
	});

	// When the host presses the 'start game' button,
	//  contact all of the players in the room and show them a different message
	socket.on('host:game-intro-starting', roomCode => {
		socket.to(roomCode).emit('host:game-intro-starting');
	})

	// When a player attempts to join a room...
	socket.on('player:join-room', data => {
		console.log('>> player:join-room: ' + data.roomCode + ' (pending)')

		// Loop through all of the 'created' rooms and check if any matches
		//  what was entered by the player
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].roomCode === data.roomCode) {
				console.log('>> player:join-room: ' + data.roomCode + ' (success)');

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
});

// Init server on *:3100
server.listen(port, () => {
	console.log('Serving on ' + port);
	console.log('Press CTRL+C to abort...')
});