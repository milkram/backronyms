import React from 'react';
import './css/RoundStart.css';

function StateRoundStart(props) {
	props.startRoundTimer()
		.then(res => {
			console.log('timer complete');
			console.log(res);
		});

	return (
		<div>
			<h1>{props.backronym.toUpperCase()}</h1>
			<h1>{props.category}</h1>

			<div className="timerwrapper">
				<div className="shrinking"></div>
			</div>
		</div>
	)
}

export default StateRoundStart;