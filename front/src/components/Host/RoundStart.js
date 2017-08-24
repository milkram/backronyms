import React from 'react';
import './css/RoundStart.css';
import BarTimer from './../Utility/BarTimer'

function StateRoundStart(props) {
	let whoHasSubmittedJSX = props.submissions.map((el, i) => {
		return (
			<li key={i}>{el.name}</li>
		)
	})
	let horizontalRuleJSX = props.submissions.length > 0 ? <hr /> : <div></div>;
	let submittedHeaderJSX = whoHasSubmittedJSX.length > 0 ?
		(
			<h3 style={{marginBottom:'0'}}>submitted:</h3>
		)
		: null;

	return (
		<div>
			<h1>{props.backronym.toUpperCase()}</h1>
			<h1>{props.category}</h1>
			<h2>judge: {props.judgeName}</h2>
			<BarTimer duration={60000} onBarTimerComplete={props.timerComplete} />
			{horizontalRuleJSX}
			{submittedHeaderJSX}
			<ul>
				{whoHasSubmittedJSX}
			</ul>
		</div>
	)
}

// class StateRoundStart extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			// All of the values here are to control the timer bar
// 			percentage: 100,
// 			destination: 0,
// 			timerAmount: 60000,
// 			runTime: 0,
// 			startTime: 0
// 		}

// 		// bindings
// 		this.tick = this.tick.bind(this);
// 	}

// 	componentDidMount() {
// 		requestAnimationFrame(this.tick);
// 	}

// 	componentWillUnmount(){
// 		// Will prevent another run of tick()
// 		//  as soon as the component is unmounted
// 		unmounted = true;
// 	}

// 	// Logic for the timer in the middle of the screen
// 	// When the timer is complete, fire off an event back to
// 	//  GameHost.js
// 	tick(timestamp) {
// 		if (unmounted === false){
// 			// Initializing the timestamp
// 			if (this.state.destination === 0) {
// 				this.setState({
// 					startTime: timestamp,
// 					destination: timestamp + this.state.timerAmount
// 				}, () => {
// 					requestAnimationFrame(this.tick)
// 				});
// 			}
// 			else {
// 				// If it's not the very first tick (which is initialization),
// 				//  run the main progress bar logic
// 				this.setState({
// 					runTime: timestamp - this.state.startTime
// 				}, () => {
// 					let percentage = (100 - ((this.state.runTime / this.state.timerAmount) * 100) < 0) ? 0
// 						: 100 - ((this.state.runTime / this.state.timerAmount) * 100);
// 					this.setState({
// 						percentage: percentage
// 					}, () => {
// 						if (this.state.runTime < this.state.timerAmount) {
// 							requestAnimationFrame(this.tick);
// 						}
// 						else {
// 							this.setState({
// 								percentage: 0
// 							}, () => {
// 								this.props.timerComplete();
// 							})
// 						}
// 					})
// 				})
// 			}
// 		}	
// 	}

// 	render() {

// 	}
// }

export default StateRoundStart;