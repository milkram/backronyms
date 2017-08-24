import React from 'react';
import './css/BarTimer.css';
import Progress from 'react-progressbar';

class BarTimer extends React.Component {
	constructor() {
		super();
		this.state = {
			// All of the values here are to control the timer bar
			percentage: 100,
			destination: 0,
			timerAmount: 0,
			runTime: 0,
			startTime: 0,
			unmounted : false
		}

		// Properties
		this._isMounted = false;

		// bindings
		this.tick = this.tick.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.setState({
			timerAmount: this.props.duration
		},()=>{
			requestAnimationFrame(this.tick);
		})
	}

	componentWillUnmount() {
		// Will prevent another run of tick()
		//  as soon as the component is unmounted

		this._isMounted = false;		
	}

	// Logic for the timer in the middle of the screen
	tick(timestamp) {
		if (this._isMounted === true) {
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
								this.props.onBarTimerComplete();
							})
						}
					})
				})
			}
		}
	}

	render() {
		return (
			<div id="bar-container">
				<Progress completed={this.state.percentage} color={'black'} />
			</div>
		)
	}
}

export default BarTimer;