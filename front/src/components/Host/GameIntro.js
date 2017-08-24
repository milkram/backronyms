import React from 'react';
import './css/GameIntro.css';

function StateGameIntro(props) {

	// console.log(props);

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
			<h3 style={{marginBottom:0}}>waiting for '{props.round.judge.name}' to select a category</h3>
			<p style={{marginTop:3}}>hurry the heck up! :D</p>
		</div>
	)
}

export default StateGameIntro;