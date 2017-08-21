import React from 'react';
// import axios from 'axios';
import './css/GamePlayer.css';
import GameLogic from '../GameLogic'
import StateLobbyPregame from './LobbyPregame'
import StateGameStarting from './GameStarting'
import StateGameStartJudge from './GameStartJudge'
import StateGameStartPlayer from './GameStartPlayer'

let socket = {};

class GamePlayer extends React.Component {
	constructor() {
		super();

		this.state = {
			'room': {},
			'gameState': 'lobbyPregame',
			// List of States:
			// ---------------------- //
			// * lobbyPregame
			// * gameStarting (game about to start, wait everyone)
			// * gameStartJudge ('you are the judge!')
			// * gameStartPlayer ('you are the player, wait up')
		}

		// Bindings
		this.setSocketListeners = this.setSocketListeners.bind(this);
	}

	componentDidMount() {
		socket = this.props.socket;

		// Initialize the state
		this.setState({
			'room': {
				'roomCode': '',
				'host': '',
				'currentJudgeName': '',
				'players': []
			}
		}, () => {
			// After the host socket is created, 
			this.setSocketListeners();
		})
	}

	setSocketListeners() {
		// When the host officially starts the game from
		//  the waiting lobby, change state to 'gameStarting'
		socket.on('host:game-intro-starting', data => {
			this.setState({
				'gameState': 'gameStarting'
			})
		})

		socket.on('host:start-game', data => {
			console.log('>> host:start-game');
		})

		socket.on('host:round-start', (judgeSocketID, judgeName) => {
			console.log('>> host:round-start');

			// Setting the name of the judge in state
			this.setState({
				'currentJudgeName': judgeName
			});

			// Display a different state depending on what was
			//  randomly selected from within GameHost.js
			if (judgeSocketID === socket.id) {
				this.setState({
					'gameState': 'gameStartJudge'
				})
			}
			else {
				this.setState({
					'gameState': 'gameStartPlayer'
				})
			}
		})
	}

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
				toRender = <StateGameStarting />
				break;
			}
			case 'gameStartJudge': {
				toRender = <StateGameStartJudge />
				break;
			}
			case 'gameStartPlayer': {
				toRender = <StateGameStartPlayer judgeName={this.state.currentJudgeName}/>
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