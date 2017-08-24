import React from 'react';
import './css/ScoreTally.css';
import BarTimer from './../Utility/BarTimer'

function StateScoreTally(props) {
	// console.log(props);

	let listJSX = props.round.score.map((el,i)=>{
		return (
			<li key={i}>
				{el.name}:
				{el.score}
			</li>
		)
	});

	let listContainerJSX = (
		<ul>
			{listJSX}
		</ul>
	)

	return (
		<div>
			<h1>here are the scores, so far!</h1>
			<BarTimer duration={15000} onBarTimerComplete={props.scoreTallyTimerComplete}/>
			<hr />
			{listJSX}
		</div>
	)
}

export default StateScoreTally;