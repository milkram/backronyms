import React from 'react';
import './css/Voting.css';
import BarTimer from './../Utility/BarTimer'

function StateVoting(props) {
	let resultsJSX = props.round.submissions.map((el, i) => {
		return (
			<li key={i}><h1>{el.entry}</h1></li>
		)
	})

	let horizontalRuleJSX = props.round.submissions.length > 0 ? <hr className='horizontal-rule' /> : <div></div>;

	return (
		<div>
			<h1>voting round!</h1>
			<BarTimer duration={30000} onBarTimerComplete={props.votingTimerComplete}/>
			{/* <hr className='horizontal-rule' /> */}
			<div id='description-container'>
				<p className='subtext' style={{marginTop:'18px'}}><strong>category</strong>: {props.round.category}</p>
				<p className='subtext' style={{marginBottom:'18px'}}><strong>judge</strong>: {props.round.judge.name}</p>
			</div>
			{horizontalRuleJSX}
			<ul>
				{resultsJSX}
			</ul>
		</div>
	)
}

export default StateVoting;


// let unmounted = false;

// class StateVoting extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			// All of the values here are to control the timer bar
// 			percentage: 100,
// 			destination: 0,
// 			timerAmount: 30000,
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
// 								this.props.votingTimerComplete();
// 							})
// 						}
// 					})
// 				})
// 			}
// 		}	
// 	}

// 	render() {
// 		let resultsJSX = this.props.round.submissions.map((el,i)=>{
// 			return (
// 				<li key={i}><h1>{el.entry}</h1></li>
// 			)
// 		})

// 		let horizontalRuleJSX = this.props.round.submissions.length > 0 ? <hr /> : <div></div>;

// 		return (
// 			<div>
// 				<h1>voting round!</h1>
// 				<div id="bar-container">
// 					<Progress completed={this.state.percentage} color={'black'} />
// 				</div>
// 				<hr />
// 				<p style={{'margin':0}}><strong>category</strong>: {this.props.round.category}</p>
// 				<p style={{'margin':0}}><strong>backronym</strong>: {this.props.round.backronym.toUpperCase()}</p>
// 				<p style={{'margin':0}}><strong>judge</strong>: {this.props.round.judge.name}</p>
// 				{horizontalRuleJSX}
// 				<ul>
// 					{resultsJSX}
// 				</ul>
// 			</div>
// 		)
// 	}
// }

// export default StateVoting;