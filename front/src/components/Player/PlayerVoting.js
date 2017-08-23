import React from 'react';
import './css/PlayerVoting.css';

function StatePlayerVoting(props) {
	console.log(props.submissions);

	let resultsJSX = props.submissions.map((el,i)=>{
		return (
			<li key={i}><button key={i}>{el.entry}</button></li>
		)
	})

	// let horizontalRuleJSX = props.submissions.length > 0 ? <hr /> : <div></div>;

	return (
		<div>
			<h1>pick your favourite!</h1>
			<p>you get more points if your vote matches the judge's vote</p>
			<hr />
			<ul>
				{resultsJSX}
			</ul>
		</div>
	)
}

export default StatePlayerVoting;