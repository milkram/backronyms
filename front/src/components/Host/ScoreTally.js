import React from 'react';
import './css/ScoreTally.css';
import BarTimer from './../Utility/BarTimer'

function StateScoreTally(props) {
	// console.log(props);

	// let listJSX = props.round.score.map((el,i)=>{
	// 	return (
	// 		<li key={i}>
	// 			{el.name}:
	// 			{el.score}
	// 		</li>
	// 	)
	// });

	// let listContainerJSX = (
	// 	<ul>
	// 		{listJSX}
	// 	</ul>
	// )

	let resultsJSX = props.round.score.map((el, i) => {
		return (
			<div className='score-container'>
				<div className='score-name'>
					<strong>{el.name}</strong>:
				</div>
				<div className='score-score'>
					{el.score} pts
				</div>
			</div>
		)
	});	

	return (
		<div>
			<h1>here are the scores, so far!</h1>
			<BarTimer duration={15000} onBarTimerComplete={props.scoreTallyTimerComplete}/>
			{/* <hr className='horizontal-rule' /> */}
			<div id='larger-score-container'>
				{resultsJSX}
			</div>
		</div>
	)
}

export default StateScoreTally;