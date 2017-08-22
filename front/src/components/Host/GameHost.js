import React from 'react';
import axios from 'axios';
import StateListeningForConnections from './ListeningForConnections'
import StateGameIntro from './GameIntro'
import StateRoundStart from './RoundStart'
import GameLogic from '../GameLogic'

// import { Link } from 'react-router';
// import Player from './components/Player'

let socket = {};

class GameHost extends React.Component {
	constructor() {
		super();

		this.state = {
			'room': {},
			'gameState': 'listeningForConnections',
			'letterFrequencies': {},
			'categories': [],
			'categoryHead': 0
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
				'currentCategory': '',
				'currentBackronym': '',
				'currentJudge': '',
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
		axios.get('http://localhost:3100/categories')
			.then(res => {
				this.setState({
					'categories': GameLogic.shuffleCategories(res.data)
				});
			});
	}

	getLetterFrequencies() {
		axios.get('http://localhost:3100/letterfreqs')
			.then(res => {
				this.setState({
					'letterFrequencies': res.data
				})
			})
	}

	timerComplete() {

	}

	startGame() {
		this.setState({
			'gameState': 'gameIntro'
		}, () => {
			socket.emit('host:game-intro-starting', this.state.room.roomCode);

			// Transition into the start game logic,
			//  with a 3000ms delay in between
			GameLogic.startGame(3000, this.state.room.players)
				.then(res => {
					// When the game start is complete, emit that the res
					//  the judge of the game, as well as the choices of categories
					let categoryChoices = GameLogic.presentCategoryChoices(this.state.categories, this.state.categoryHead);

					// Set the currentJudge in the 'room'
					let modifiedRoom = this.state.room;
					modifiedRoom.currentJudge = res.name;

					// Set the new category head position
					this.setState({
						'categoryHead': this.state.categoryHead + 3,
						'room' : modifiedRoom
					})

					socket.emit('host:round-start', this.state.room.roomCode, res.socket, res.name, categoryChoices);
				})
				.catch(err => {
					console.log(err);
				})
		});
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
				socket: data.socket
			})
			// In the parent 'room' object, add in the modifiedPlayers array
			modifiedRoom.roomCode = this.props.roomCode.toLowerCase();
			modifiedRoom.host = socket.id;
			modifiedRoom.players = modifiedPlayers;

			// Set to state the newly modifiedRoom
			this.setState({
				room: modifiedRoom
			});

			// Push the data onto the server..?
		});

		socket.on('judge:select-category', category => {
			console.log(`>> judge:select-category: ${JSON.stringify(category)}`);

			// Generate the backronym for the round
			let backronym = GameLogic.generateBackronym(this.state.letterFrequencies);
			socket.emit('host:generate-backronym', this.state.room.roomCode, backronym);

			// Fetch and modify the current room information to change the category
			let modifiedRoom = this.state.room;
			modifiedRoom.currentCategory = category;
			modifiedRoom.currentBackronym = backronym;

			// Save state
			this.setState({
				gameState: 'roundStart',
				room: modifiedRoom
			})
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
					<StateRoundStart category={this.state.room.currentCategory} backronym={this.state.room.currentBackronym} timerComplete={this.timerComplete} judgeName={this.state.room.currentJudge}/>
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