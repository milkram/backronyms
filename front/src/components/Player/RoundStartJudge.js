import React from 'react';
import './css/RoundStartJudge.css';

function StateRoundStartJudge(props) {
	let categoryChoicesJSX = props.categoryChoices.map((el, i) => {
		return (
			<li key={i}>
				<button onClick={() => { props.selectCategory(el) }}>{el}</button>
			</li>
		)
	})

	return (
		<div>
			<h1 style={{ marginBottom: 3 }}>you are the judge!</h1>
			<hr className='horizontal-rule' />
			<div>
				<h3>choose a category:</h3>
				<ul>
					{categoryChoicesJSX}
				</ul>
			</div>
		</div>
	)
}

export default StateRoundStartJudge;