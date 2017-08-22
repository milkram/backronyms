import React, { Component } from 'react';
import './css/App.css';
import io from 'socket.io-client';
import axios from 'axios';
// import { Link } from 'react-router';

let socket = {};

class App extends Component {
	constructor() {
		super();
		this.state = {
			roomInput: '',
			nameInput: '',
			roomCode: '',
		}

		// Init bindings
		this.setNewRoomCode = this.setNewRoomCode.bind(this);
		this.startHosting = this.startHosting.bind(this);
		this.updateRoomInput = this.updateRoomInput.bind(this);
		this.updateNameInput = this.updateNameInput.bind(this);
		this.joinRoom = this.joinRoom.bind(this);
	}

	componentDidMount() {
		// Generating the random room code upon launch
		this.setNewRoomCode();
	}

	updateRoomInput(event) {
		let newRoomInput = event.target.value;
		this.setState({
			roomInput: newRoomInput
		})
	}

	updateNameInput(event) {
		let newNameInput = event.target.value;
		this.setState({
			nameInput: newNameInput
		})
	}
	
	startHosting() {
		// Connect the hosting client
		socket = io('http://localhost:3100');
		socket.connect();
		socket.emit('host:make-room', this.state.roomCode.toLowerCase());
	}

	joinRoom() {
		// Using a regex to check if this.state.roomInput is
		//  4 characters and uses only consonants
		if (/^[bcdfghjklmnpqrstvwxyz]{4}$/.test(this.state.roomInput.toLowerCase()) && this.state.nameInput !== '') {
			socket = io('http://localhost:3100');
			socket.connect();
			socket.emit('player:join-room', {
				'roomCode': this.state.roomInput.toLowerCase(),
				'name': this.state.nameInput
				// 'socket' : socket -- this causes an error
			});
		}
	}

	setNewRoomCode() {
		let text = '';
		let possible = "BCDFGHJKLMNPQRSTVWXYZ"; // only consonants!

		for (var i = 0; i < 4; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		axios.get('http://localhost:3100/make/' + text)
			.then(res => {
				this.setState({
					roomCode: text
				});
			}, error => {
				// If a room already exists with the newly generated code above,
				//  keep making new room codes until a unique one pops up
				// console.log("error");
				this.setNewRoomCode();
			})
			.catch(error => {
				// console.log("catch");
			});
	}

	render() {
		return (
			<div className="App">
				<div>
					{React.cloneElement(this.props.children, { 
						// Home Page
						'roomCode': this.state.roomCode,
						'setNewRoomCode': this.setNewRoomCode,
						'startHosting': this.startHosting,
						'updateRoomInput': this.updateRoomInput,
						'updateNameInput': this.updateNameInput,
						'roomInput': this.state.roomInput,
						'nameInput': this.state.nameInput,
						'joinRoom': this.joinRoom,
						// Game+Host Clients
						'socket' : socket,
						// Game Client Specific
						// Host Client Specific
						 })}
				</div>
			</div>
		);
	}
}

export default App;