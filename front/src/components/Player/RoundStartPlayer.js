import React from 'react';
import './css/RoundStartPlayer.css';

function StateRoundStartPlayer(props) {
	return (
		<div>
			<h1>{props.judgeName} is the judge!</h1>
			<hr className='horizontal-rule' />
			<h3>waiting for a category to be selected...</h3>
		</div>
	)
}

export default StateRoundStartPlayer;