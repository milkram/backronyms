import React from 'react';
// import axios from 'axios';
import './css/GamePlayer.css';
// import GameLogic from '../GameLogic'
import StateLobbyPregame from './LobbyPregame'
import StateRoundStarting from './RoundStarting'
import StateRoundStartJudge from './RoundStartJudge'
import StateRoundStartPlayer from './RoundStartPlayer'
import StateRoundActiveJudge from './RoundActiveJudge'
import StateRoundActivePlayer from './RoundActivePlayer'

let socket = {};

class GamePlayer extends React.Component {
	constructor() {
		super();

		this.state = {
			'roomCode': '',
			'gameState': 'lobbyPregame',
			'categoryChoices': [],
			'category': '',
			'backronym': ''
			// 'letterFrequencies' : {}
			// List of States:
			// ---------------------- //
			// * lobbyPregame
			// * gameStarting (game about to start, wait everyone)
			// * gameStartJudge ('you are the judge!')
			// * gameStartPlayer ('you are the player, wait up')
		}

		// Bindings
		this.setSocketListeners = this.setSocketListeners.bind(this);
		this.selectCategory = this.selectCategory.bind(this);
	}

	componentDidMount() {
		socket = this.props.socket;

		// Initialize the state
		this.setState({
			'roomCode': this.props.roomInput.toLowerCase()
		}, () => {
			// After the host socket is created, 
			this.setSocketListeners();
		})

		// Fetch the current letter frequencies from the server
		// this.getLetterFrequencies();
	}

	// getLetterFrequencies() {
	// 	axios.get('http://localhost:3100/letterfreqs')
	// 		.then(res => {
	// 			this.setState({
	// 				'letterFrequencies': res.data
	// 			})
	// 		})
	// }

	setSocketListeners() {
		// When the host officially starts the game from
		//  the waiting lobby, change state to 'gameStarting'
		socket.on('host:game-intro-starting', () => {
			console.log(`>> host:game-intro-starting`);
		});

		// socket.on('host:start-game', data => {
		// 	console.log(`>> host:start-game: ${JSON.stringify(data)}`);
		// });

		socket.on('host:round-start', (judgeSocketID, judgeName, categoryChoices) => {
			console.log(`>> host:round-start: ${judgeSocketID}, ${judgeName}, ${JSON.stringify(categoryChoices)}`);

			// Setting the name of the judge in state
			this.setState({
				'currentJudgeName': judgeName
			});

			// Display a different state depending on what was
			//  randomly selected from within GameHost.js
			if (judgeSocketID === socket.id) {
				this.setState({
					'gameState': 'gameStartJudge',
					'categoryChoices': categoryChoices
				})
			}
			else {
				this.setState({
					'gameState': 'gameStartPlayer'
				})
			}
		});

		socket.on('judge:select-category', name => {
			console.log(`>> judge:select-category: ${name}`);
		});

		socket.on('host:generate-backronym', backronym =>{
			console.log(`>> host:generate-backronym: ${backronym}`)
		});
	}

	// When the judge selects the category out of the three choices
	selectCategory(name) {
		socket.emit('judge:select-category', this.state.roomCode, name);
		this.setState({
			'category': name
		});
	}

	// makeBackronym(){
	// 	// Generate the backronym for the round
	// 	let backronym = GameLogic.generateBackronym(this.state.letterFrequencies);
	// }

	render() {
		let toRender;
		switch (this.state.gameState) {
			default: {
				toRender = <div>default, fix this</div>
				break;
			}
			case 'lobbyPregame': {
				toRender = <StateLobbyPregame />
				break;
			}
			case 'gameStarting': {
				toRender = <StateRoundStarting />
				break;
			}
			case 'gameStartJudge': {
				toRender = <StateRoundStartJudge categoryChoices={this.state.categoryChoices} selectCategory={this.selectCategory} />
				break;
			}
			case 'gameStartPlayer': {
				toRender = <StateRoundStartPlayer judgeName={this.state.currentJudgeName} />
				break;
			}
			case 'gameActiveJudge': {
				toRender = <StateRoundActiveJudge category={this.state.category} />
				break;
			}
			case 'gameActivePlayer': {
				toRender = <StateRoundActivePlayer judgeName={this.state.currentJudgeName} />
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
export default GamePlayer;