import React from 'react';
import './css/LobbyPregame.css';
// import { Link } from 'react-router';
import Header from './../Header';

function StateLobbyPregame(props) {
	return (
		<div>
			<Header />
			<h3>waiting for other players, hang tight!</h3>
		</div>
	)
}

export default StateLobbyPregame;