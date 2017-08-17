import React from 'react';
// import axios from 'axios';
import './css/GamePlayer.css';
import StateLobbyPregame from './LobbyPregame'
import StateGameStart from './GameStart'

// import { Link } from 'react-router';
// import Player from './components/Player'

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
			// * gameStart
			// * 
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
				'host' : '',
				'players': []
			}
		}, () => {
			// After the host socket is created, 
			this.setSocketListeners();
		})
	}

	setSocketListeners() {
		// When the host officially starts the game from
		//  the waiting lobby, change state to 'gameStart'
		socket.on('host:game-intro-starting', data => {
			this.setState({
				'gameState' : 'gameStart'
			})
		})		

		socket.on('host:start-game', data => {
			console.log('>> host:start-game');
		})
	}

	render (){
		let toRender;
		switch (this.state.gameState) {
			default: {
				toRender = <div>default, fix this</div>
				break;
			}
			case 'lobbyPregame':{
				toRender = <StateLobbyPregame />
				break;
			}
			case 'gameStart':{
				toRender = <StateGameStart />
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