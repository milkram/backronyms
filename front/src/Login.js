import React from 'react';
import './css/Login.css';
import { Link } from 'react-router';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			'input': '',
			// 'submission': '',
			'showError': false,
			// 'showEntry': false,
			'errorMessage': 'please enter a valid room code/name input',
			'redirect': false,
			'redirecting': false
		}
	}

	render() {
		let headerJSX = (
			<div>
				<h1 style={{ marginBottom: '0' }}>backronyms</h1>
				<p style={{ margin: '0' }}>the game of making something from nothing</p>
				<hr className="horizontal-rule" />
			</div>
		);

		let joinGameButtonJSX = (
			<button id='start-button' onClick={(event) => {
				this.props.joinRoom(event)
					.then(res => {
						// Manually redirecting to gameplayer instead of <Link />
						this.props.router.push('gameplayer');
					})
					.catch(rej => {
						this.setState({
							'showError': true
						})
					});
			}}>
				join game
			</button>
		)

		let formContainerJSX = (
			<div id="form-container">
				<div>
					<h2 className="form-header inline-block">room code:</h2>
					<form className="no-margins inline-block">
						<input value={this.props.roomInput} onChange={this.props.updateRoomInput} />
					</form>
				</div>
				<div>
					<h2 className="form-header inline-block">your name:</h2>
					<form className="no-margins inline-block">
						<input value={this.props.nameInput} onChange={this.props.updateNameInput} />
					</form>
				</div>
				{joinGameButtonJSX}
				{/* <button onClick={props.joinRoom} id="start-button"><Link to='gameplayer' id='link-join-game'>join game</Link></button> */}
			</div>
		)

		let showErrorJSX = <div></div>
		if (this.state.showError === true) {
			showErrorJSX = (
				<h4 id='error-text'>{this.state.errorMessage}</h4>
			)
		}

		return (
			<div>
				{headerJSX}
				{formContainerJSX}
				{showErrorJSX}
				<hr className="horizontal-rule" />
				<Link to="/host">host a game?</Link>
			</div>
		)
	}
}

export default Login;