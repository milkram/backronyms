import React from 'react';
import './css/GameIntro.css';

function StateGameIntro(props) {

	// // Defining variables
	// let _playersInRoom = 0;

	// // Populating arrayJSX with the name of each
	// //  player that joins into the room
	// let arrayJSX = [];
	// if (Array.isArray(props.room.players)){
	// 	arrayJSX = props.room.players.map((el,i)=>{

	// 		// Counting how many players are in the room
	// 		_playersInRoom++;

	// 		return (
	// 			<li key={i}>
	// 				{el.name}
	// 			</li>
	// 		)
	// 	})
	// }

	// // The Ready button -- advances the game forward to another state
	// let readyButtonJSX = (
	// 	<button onClick={props.advanceGameState}>start game!</button>
	// )

	return (
		<div>
			<h1>game intro</h1>
			{/* <h1>host waiting</h1>
			<ul>
				{arrayJSX}
			</ul>
			{(_playersInRoom >= 1) ? readyButtonJSX : <div></div>} */}
		</div>
	)
}

export default StateGameIntro;