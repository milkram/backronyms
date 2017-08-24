import React from 'react';
import './css/RoundInProgress.css';

class StateRoundInProgress extends React.Component {
	constructor() {
		super();

		this.state = {
			'input': '',
			'submission': '',
			'showError': false,
			'showEntry': false,
			'errorMessage' : ''
		}

		this.onFormChange = this.onFormChange.bind(this);
	}

	onFormChange(event) {
		this.setState({
			'input': event.target.value
		})
	}

	componentDidMount(){
		console.log(this.props.socketID);
	}

	render() {
		let headerJSX;
		if (this.props.socketID === this.props.judge.socketID) {
			headerJSX = (
				<div><h1>you are the judge!</h1></div>
			)
		}
		else {
			headerJSX = (
				<div>
					<h1>{this.props.judge.name} is the judge!</h1>
				</div>
			)
		}

		let showErrorJSX = <div></div>
		if (this.state.showError === true) {
			showErrorJSX = (
				<h4 id='error-text'>{this.state.errorMessage}</h4>
			)
		}

		let showEntryJSX = <div></div>
		if (this.state.showEntry === true) {
			showEntryJSX = (
				<h3>{this.state.submission}</h3>
			)
		}

		return (
			<div>
				{headerJSX}
				<hr />
				<h3>{this.props.category}</h3>
				<h1>{this.props.backronym.toUpperCase()}</h1>
				{showEntryJSX}
				<hr />
				{showErrorJSX}
				<form id='form'>
					<input value={this.state.input} onChange={this.onFormChange}>
					</input>
					<button onClick={(event) => {
						this.props.submitBackronym(event, this.state.input, this.state.submission)
							.then(res => {
								this.setState({
									'submission': res.entry,
									'showEntry': true,
									'showError': false
								})
							})
							.catch(rej => {
								if (rej.code.toString()[0] !== '3'){
									this.setState({
										'showError': true,
										'errorMessage' : rej.message
									})
								}
							});
					}} id='submit-button'>
						submit
					</button>
				</form>
			</div>
		)
	}
}

export default StateRoundInProgress;