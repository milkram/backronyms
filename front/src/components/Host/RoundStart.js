import React from 'react';
import './css/RoundStart.css';
import Progress from 'react-progressbar';

class StateRoundStart extends React.Component {
	constructor() {
		super();
		this.state = {
			// All of the values here are to control the timer bar
			percentage: 100,
			destination: 0,
			timerAmount: 60000,
			runTime: 0,
			startTime: 0
		}

		// bindings
		this.tick = this.tick.bind(this);
	}

	componentDidMount() {
		requestAnimationFrame(this.tick);
	}

	// Logic for the timer in the middle of the screen
	// When the timer is complete, fire off an event back to
	//  GameHost.js
	tick(timestamp) {
		// Initializing the timestamp
		if (this.state.destination === 0) {
			this.setState({
				startTime: timestamp,
				destination: timestamp + this.state.timerAmount
			}, () => {
				requestAnimationFrame(this.tick)
			});
		}
		else {
			// If it's not the very first tick (which is initialization),
			//  run the main progress bar logic
			this.setState({
				runTime: timestamp - this.state.startTime
			}, () => {
				let percentage = (100 - ((this.state.runTime / this.state.timerAmount) * 100) < 0) ? 0
					: 100 - ((this.state.runTime / this.state.timerAmount) * 100);
				this.setState({
					percentage: percentage
				}, () => {
					if (this.state.runTime < this.state.timerAmount) {
						requestAnimationFrame(this.tick);
					}
					else {
						this.setState({
							percentage: 0
						}, () => {
							this.props.timerComplete();
						})
					}
				})
			})
		}
	}

	render() {
		return (
			<div>
				<h1>{this.props.backronym.toUpperCase()}</h1>
				<h1>{this.props.category}</h1>
				<h2>{this.props.judgeName}</h2>
				<div id="bar-container">
					<Progress completed={this.state.percentage} color={'black'} />
				</div>
			</div>
		)
	}
}

export default StateRoundStart;