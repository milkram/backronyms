import React from 'react';
import './css/Results.css';
import BarTimer from './../Utility/BarTimer'

function StateResults (props){

	let headerJSX = (
		<div>
			<h1>the results are in!</h1>
			<BarTimer duration={15000} onBarTimerComplete={props.resultsTimerComplete}/>
			<hr />
		</div>
	)

	let backronymJSX = (
		<h1>{props.backronym.toUpperCase()}</h1>
	)

	let resultsJSX = props.submissions.map((el, i) => {
		return (
			<li key={i}>
				{el.entry}
				{el.votes.length}
			</li>
		)
	})

	let listContainerJSX = (
		<ul>
			{resultsJSX}
		</ul>
	)

	return (
		<div>
			{headerJSX}
			{backronymJSX}
			{listContainerJSX}
		</div>
	)	
}

export default StateResults;

// class StateResults extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 		}

// 		// bindings
// 		this.onBarTimerComplete = this.onBarTimerComplete.bind(this);
// 	}

// 	componentDidMount() {
// 		console.log('this.props.submissions:')
// 		console.log(this.props.submissions);
// 	}

// 	onBarTimerComplete(){
// 		console.log("bar timer complete");
// 	}

// 	render() {
// 		let headerJSX = (
// 			<div>
// 				<h1>the results are in!</h1>
// 				<BarTimer duration={15000} onBarTimerComplete={this.onBarTimerComplete}/>
// 				<hr />
// 			</div>
// 		)
// 		let backronymJSX = (
// 			<h1>{this.props.backronym.toUpperCase()}</h1>
// 		)
// 		let resultsJSX = this.props.submissions.map((el, i) => {
// 			return (
// 				<li key={i}>
// 					{el.entry}
// 					{el.votes.length}
// 				</li>
// 			)
// 		})

// 		let listContainerJSX = (
// 			<ul>
// 				{resultsJSX}
// 			</ul>
// 		)

// 		return (
// 			<div>
// 				{headerJSX}
// 				{backronymJSX}
// 				{listContainerJSX}
// 			</div>
// 		)
// 	}
// }

// export default StateResults;