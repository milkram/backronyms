import React from 'react';
import './css/GameIntro.css';
import Header from './../Header';

function StateGameIntro(props) {
	return (
		<div>
			<Header />
			<h3 style={{marginBottom:0}}>waiting for '{props.round.judge.name}' to select a category</h3>
			<p style={{marginTop:3}}>hurry the heck up! :D</p>
		</div>
	)
}

export default StateGameIntro;