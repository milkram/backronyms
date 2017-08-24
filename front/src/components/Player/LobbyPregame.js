import React from 'react';
import './css/LobbyPregame.css';
// import { Link } from 'react-router';

function StateLobbyPregame(props) {
	let headerJSX = (
		<div>
			<h1 style={{ marginBottom: '0' }}>backronyms</h1>
			<p style={{ margin: '0' }}>the game of making something from nothing</p>
			<hr className="horizontal-rule" />
		</div>
	);

	return (
		<div>
			{headerJSX}
			<h3>waiting for other players, hang tight!</h3>
		</div>
	)
}

export default StateLobbyPregame;