import React from 'react';
// import axios from 'axios';
// import './css/GameHost.css';
import StateListeningForConnections from './ListeningForConnections'
import StateGameIntro from './GameIntro'
import GameLogic from '../GameLogic'

// import { Link } from 'react-router';
// import Player from './components/Player'

let socket = {};

class GameHost extends React.Component {
	constructor() {
		super();

		this.state = {
			// 'hostSocket': {},
			'room': {},
			'gameState': 'listeningForConnections',
			// List of States:
			// ---------------------- //
			// * waitingForConnections
			// * gameIntro
			// * 
		}

		// Bindings
		this.setSocketListeners = this.setSocketListeners.bind(this);
		this.advanceGameState = this.advanceGameState.bind(this);
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

	advanceGameState(){
		switch (this.state.gameState){
			default:{
				break;
			}
			case 'listeningForConnections':{
				this.setState({
					'gameState': 'gameIntro'
				},()=>{
					socket.emit('host:game-intro-starting',this.state.room.roomCode);

					console.log("running");

					GameLogic.hello()
						.then(res=>{
							console.log(res);
						})
						.catch(err=>{
							console.log(err);
						})
					});
				break;
			}
		}
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
			modifiedRoom = {
				'roomCode': this.props.roomCode.toLowerCase(),
				'host': socket.id,
				'players': modifiedPlayers
			}

			// Set to state the newly modifiedRoom
			this.setState({
				room: modifiedRoom
			});

			// Push the data onto the server..?
		})
	}

	render() {
		let toRender;
		switch (this.state.gameState) {
			default: {
				toRender = <div>default, fix this</div>
				break;
			}
			case 'listeningForConnections': {
				toRender = <StateListeningForConnections room={this.state.room} advanceGameState={this.advanceGameState}/>
				break;
			}
			case 'gameIntro':{
				toRender = <StateGameIntro room={this.state.room} advanceGameState={this.advanceGameState}/>
				break;
			}
			case '':{

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