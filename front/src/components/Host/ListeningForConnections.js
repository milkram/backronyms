import React from 'react';
import './css/ListeningForConnections.css';
// import { Link } from 'react-router';

class StateListeningForConnections extends React.Component {
	constructor() {
		super();
	}
	render() {
		// Defining variables
		let _playersInRoom = 0;

		// let headerJSX = (
		// 	<div>
		// 		<h1 style={{ marginBottom: '0' }}>backronyms</h1>
		// 		<p style={{ margin: '0' }}>the game of making something from nothing</p>
		// 		<hr className="horizontal-rule" />
		// 	</div>
		// );

		// Populating arrayJSX with the name of each
		//  player that joins into the room
		let arrayJSX = [];
		if (Array.isArray(this.props.room.players)) {
			arrayJSX = this.props.room.players.map((el, i) => {

				// Counting how many players are in the room
				_playersInRoom++;

				return (
					<li key={i}>
						{el.name}
					</li>
				)
			})
		}

		let playersListJSX = (
			arrayJSX.length > 0 ? (
				<div>
					<h4 className='instructions-header'>connected:</h4>
					{arrayJSX}
				</div>
			)
			: null
		)

		let horizontalRuleJSX = (
			arrayJSX.length > 0 ? <hr className='horizontal-rule'/> : null
		)

		// The Ready button -- advances the game forward to another state
		let readyButtonJSX = (
			<button id='ready-button' onClick={this.props.startGame}>start game!</button>
		)

		let roomCode = '';
		if (typeof(this.props.room.roomCode) == "string"){
			roomCode = this.props.room.roomCode;
		}

		let instructionsJSX = (
			<div id='instructions-container'>
				<h4 className='instructions-header'>how to join:</h4>
				<p className='instructions-text'>- navigate to http://54.218.83.100/</p>
				<p className='instructions-text'>- type in room code: <strong>{roomCode.toUpperCase()}</strong></p>
				<p className='instructions-text'>- type in your silly name</p>
				<p className='instructions-text'>- tell your friends!</p>
			</div>
		)

		// console.log(this.props);

		return (
			<div>
				{/* {headerJSX} */}
				<h2 id='main-header'>we're waiting for connections!</h2>
				<p id='sub-header'>minimum 3 players, maximum of who knows!</p>
				<hr className='horizontal-rule' />
				<ul>
					{playersListJSX}
				</ul>				
				{horizontalRuleJSX}
				{instructionsJSX}
				{(_playersInRoom >= 3) ? readyButtonJSX : <div></div>}
			</div>
		)
	}
}

export default StateListeningForConnections;