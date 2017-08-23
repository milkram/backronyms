import React from 'react';
import axios from 'axios';
import StateListeningForConnections from './ListeningForConnections'
import StateGameIntro from './GameIntro'
import StateRoundStart from './RoundStart'
import StateVoting from './Voting'
import GameLogic from '../GameLogic'

// import { Link } from 'react-router';
// import Player from './components/Player'

let socket = {};
let timerCompletePassthrough = true;

class GameHost extends React.Component {
	constructor() {
		super();

		this.state = {
			'room': {},
			'gameState': 'listeningForConnections',
			'letterFrequencies': {},
			'categories': [],
			'categoryHead': 0,
			'currentRound': {
				'round': 0,
				'score': [
					// {
					// 'name': '',
					// 'socketID': '',
					// 'score': 0
					// }
				],
				'judge': {
					// 'name': '',
					// 'socketID': ''
				},
				'backronym': '',
				'category': '',
				'submissions': [
					// {
					// 'name': '',
					// 'socketID': '',
					// 'entry': '',
					// 'votes': [
					// 	{
					// 		'name': '',
					// 		'socketID': ''
					// 	}
					// ]
					// }
				],
			},
			'history': []

			// List of States:
			// ---------------------- //
			// * listeningForConnections
			// * gameIntro
			// * 
		}

		// Bindings
		this.setSocketListeners = this.setSocketListeners.bind(this);
		this.startGame = this.startGame.bind(this);
		this.getCategories = this.getCategories.bind(this);
		this.getLetterFrequencies = this.getLetterFrequencies.bind(this);
		this.timerComplete = this.timerComplete.bind(this);
	}

	componentDidMount() {
		socket = this.props.socket;

		// Initialize the state
		this.setState({
			'room': {
				'roomCode': '',
				'host': '',
				'players': []
			}
		}, () => {
			// After the host socket is created
			this.setSocketListeners();
		})

		// Fetch the categories from the server
		this.getCategories();

		// Fetch the current letter frequencies from the server
		this.getLetterFrequencies();
	}

	getCategories() {
		// axios.get('http://localhost:3100/categories')
		axios.get('/categories')
			.then(res => {
				this.setState({
					'categories': GameLogic.shuffleCategories(res.data)
				});
			});
	}

	getLetterFrequencies() {
		// axios.get('http://localhost:3100/letterfreqs')
		axios.get('/letterfreqs')
			.then(res => {
				this.setState({
					'letterFrequencies': res.data
				})
			})
	}

	timerComplete() {
		// This method is called either when the timer has hit 0 seconds and not all submissions were submitted,
		//  or all of the submissions were submitted before the timer was actually complete,
		//  which will call this method as well

		if (timerCompletePassthrough === true) {
			socket.emit('host:submission-round-complete', this.state.room.roomCode, this.state.currentRound.submissions, this.state.room.players.length);

			// Change the state/view to the voting round
			this.setState({
				'gameState': 'voting'
			})
		}
	}

	startGame() {
		// First time the game is starting -- initialize some values into state
		this.setState({
			'gameState': 'gameIntro',
		}, () => {
			socket.emit('host:game-intro-starting', this.state.room.roomCode);

			// Transition into the start game logic,
			//  with a 3000ms delay in between
			GameLogic.startGame(3000, this.state.room.players)
				.then(res => {
					// When the game start is complete, emit that the res
					//  the judge of the game, as well as the choices of categories
					let categoryChoices = GameLogic.presentCategoryChoices(this.state.categories, this.state.categoryHead);

					// Figuring out who the judge is, and offering that device the three category choices
					socket.emit('host:round-start', this.state.room.roomCode, res.socketID, res.name, categoryChoices);

					// Save the judge into state
					let modifiedCurrentRound = this.state.currentRound;
					modifiedCurrentRound.judge.name = res.name;
					modifiedCurrentRound.judge.socketID = res.socketID;

					// Create a new score-card and add to modifiedCurrentRound
					let newScore = [];
					for (let i=0; i<this.state.room.players.length; i++){
						let scoreObj = {
							'name' : this.state.room.players[i].name,
							'socketID' : this.state.room.players[i].socketID,
							'score' : 0
						}
						newScore.push(scoreObj);
					}
					modifiedCurrentRound.score = newScore;

					// Set the round number to 1 (since new game)
					modifiedCurrentRound.round = 1;

					// Save judge + category head + scoreCard
					this.setState({
						'categoryHead': this.state.categoryHead + 3,
						currentRound: modifiedCurrentRound
					})
				})
				.catch(err => {
					console.log(err);
				})
		});
	}

	startNewRound() {
		// Not the first time game is starting -- update state values
		let previousRound = this.state.currentRound;
		let modifiedHistory = this.state.history;

		// Save the values that need to be carried over (round number and score)
		let newRoundNumber = this.state.currentRound.round + 1;
		let newScore = this.state.currentRound.score;

		// Push the previous round onto the round history
		modifiedHistory.push(previousRound);

		// Create a fresh/new 'currentRound' object
		this.setState({
			'currentRound': {
				'round': newRoundNumber,
				'score': newScore,
				'judge': {},
				'backronym': '',
				'category': '',
				'submissions': []
			}
		})
	}

	setSocketListeners() {
		// When a new player has joined into the game, 
		//  add their information into this room's data
		socket.on('host:join-room-success', data => {
			console.log('>> host:join-room-success: ' + data.name + ' joined in!');

			// Fetch the room object and the 'players' array within
			let modifiedRoom = this.state.room;
			let modifiedPlayers = this.state.room.players;

			// In the 'players' array, add the new incoming player info
			modifiedPlayers.push({
				name: data.name,
				socketID: data.socket
			})
			// In the parent 'room' object, add in the modifiedPlayers array
			modifiedRoom.roomCode = this.props.roomCode.toLowerCase();
			modifiedRoom.host = socket.id;
			modifiedRoom.players = modifiedPlayers;

			// Set to state the newly modifiedRoom
			this.setState({
				room: modifiedRoom
			});
		});

		// When the judge selects a category, display it...
		socket.on('judge:select-category', category => {
			console.log(`>> judge:select-category: ${JSON.stringify(category)}`);

			// Generate the backronym for the round
			let backronym = GameLogic.generateBackronym(this.state.letterFrequencies);
			socket.emit('host:generate-backronym', this.state.room.roomCode, backronym);

			// Save the category + the backronym into 'currentRound'
			let modifiedCurrentRound = this.state.currentRound;
			modifiedCurrentRound.category = category;
			modifiedCurrentRound.backronym = backronym;

			this.setState({
				gameState: 'roundStart',
				currentRound: modifiedCurrentRound
			})
		});

		// When a player submits a verified backronym, display it...
		socket.on('player:submit-backronym', (backronym, socketID) => {
			console.log(`>> player:submit-backronym: ${backronym}`);

			// Loop through all of the players in the room to find out their player name
			let playerName = '';
			for (let i = 0; i < this.state.room.players.length; i++) {
				if (this.state.room.players[i].socketID === socketID) {
					playerName = this.state.room.players[i].name;
				}
			}

			// Fetch the currentRound.submissions array and add to it
			let modifiedCurrentRound = this.state.currentRound;
			let modifiedSubmissions = this.state.currentRound.submissions;

			// Add the entry to the submissions array
			modifiedSubmissions.push({
				'name': playerName,
				'socketID': socketID,
				'entry': backronym,
				'votes': []
			})

			// Add the submissions array to the currentRound
			modifiedCurrentRound.submissions = modifiedSubmissions;

			this.setState({
				'currentRound': modifiedCurrentRound
			}, () => {

				// If all of the players have submitted answers, immediately call timerComplete()
				if (this.state.currentRound.submissions.length === this.state.room.players.length) {
					this.timerComplete();
				}
			});
		});
	}

	render() {
		let toRender;
		switch (this.state.gameState) {
			default: {
				toRender = <div>default, fix this</div>
				break;
			}
			case 'listeningForConnections': {
				toRender = <StateListeningForConnections room={this.state.room} startGame={this.startGame} />
				break;
			}
			case 'gameIntro': {
				toRender = <StateGameIntro room={this.state.room} />
				break;
			}
			case 'roundStart': {
				toRender = (
					<StateRoundStart category={this.state.currentRound.category} backronym={this.state.currentRound.backronym} timerComplete={this.timerComplete} judgeName={this.state.currentRound.judge.name} submissions={this.state.currentRound.submissions} />
				)
				break;
			}
			case 'voting': {
				toRender = (
					<StateVoting round={this.state.currentRound}/>
				)
				break;
			}
		}

		return (
			<div>
				{toRender}
			</div>
		)
	}
}
export default GameHost;