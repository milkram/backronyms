import React from 'react';
import './css/Results.css';
import BarTimer from './../Utility/BarTimer'

function StateResults(props) {

	let headerJSX = (
		<div>
			<h1>the results are in!</h1>
		</div>
	)

	// let backronymJSX = (
	// 	<h1>{props.backronym.toUpperCase()}</h1>
	// )

	// let resultsJSX = props.submissions.map((el, i) => {
	// 	return (
	// 		<li key={i}>
	// 			{el.entry}
	// 			{el.votes.length}
	// 		</li>
	// 	)
	// })

	// let listContainerJSX = (
	// 	<ul>
	// 		{resultsJSX}
	// 	</ul>
	// )

	// console.log(props);

	let resultsJSX = props.submissions.map((el, i) => {
		return (
			<div className='score-container'>
				<div className='score-name'>
					<strong>{el.name}</strong>:
				</div>
				<div className='score-entry'>
					<h3>{el.entry}</h3>
				</div>
				<div className='score-votes'>
					{el.votes.length} votes
				</div>
			</div>
		)
	});

	return (
		<div>
			{headerJSX}
			<BarTimer duration={20000} onBarTimerComplete={props.resultsTimerComplete} />
			<div id='larger-score-container'>
				{resultsJSX}
			</div>
		</div>
	)
}

export default StateResults;