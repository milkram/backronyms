import React from 'react';
import './css/PlayerVoting.css';

class StatePlayerVoting extends React.Component {
	constructor() {
		super();
		this.state = {
			voteSelected: false,
			entry: ''
		}
	}
	render() {
		let headerJSX = null;
		let renderJSX = null;
		if (this.state.voteSelected === false) {
			headerJSX = (
				<div>
					<div id='header-container'>
						<h1>vote for your favourite!</h1>
						<p className='description-text'>- you'll get more points if your vote matches the judge's vote</p>
					</div>
					<hr className='horizontal-rule' />					
				</div>
			)
			renderJSX = this.props.submissions.reduce((acc, el, i) => {
				if (el.socketID !== this.props.socketID) {
					acc.push(<li key={i}><button onClick={(event) => {
						this.props.submitVote(event, i, this.props.name, this.props.socketID);
						this.setState({
							voteSelected: true,
							entry: el.entry
						})
					}} key={i}>{el.entry}</button></li>);
				}
				return acc;
			}, []);
		}
		else {
			renderJSX = (
				<div>
					<p>you voted:</p>
					<h3>{this.state.entry}</h3>
					<p>no takeback-sies!</p>
				</div>
			)
		}

		return (
			<div>
				{headerJSX}
				<ul>
					{renderJSX}
				</ul>
			</div>
		)
	}
}

export default StatePlayerVoting;