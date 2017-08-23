import React from 'react';
import './css/Voting.css';

function StateVoting (props) {
	console.log(props.round);

	let resultsJSX = props.round.submissions.map((el,i)=>{
		return (
			<li key={i}><h1>{el.entry}</h1></li>
		)
	})

	let horizontalRuleJSX = props.round.submissions.length > 0 ? <hr /> : <div></div>;

	return (
		<div>
			<h1>voting round!</h1>
			<hr />
			<p style={{'margin':0}}><strong>category</strong>: {props.round.category}</p>
			<p style={{'margin':0}}><strong>backronym</strong>: {props.round.backronym.toUpperCase()}</p>
			<p style={{'margin':0}}><strong>judge</strong>: {props.round.judge.name}</p>
			{horizontalRuleJSX}
			<ul>
				{resultsJSX}
			</ul>
		</div>
	)
}

export default StateVoting;