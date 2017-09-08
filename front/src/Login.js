import React from 'react';
import './css/Login.css';
import { Link } from 'react-router';
import Header from './components/Header';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			'input': '',
			// 'submission': '',
			'showError': false,
			// 'showEntry': false,
			'errorMessage': '',
			'redirect': false,
			'redirecting': false
		}
	}

	render() {
		let joinGameButtonJSX = (
			<button id='start-button' onClick={(event) => {
				this.props.joinRoom(event)
					.then(res => {
						// Manually redirecting to gameplayer instead of <Link />
						this.props.router.push('gameplayer');
					})
					.catch(rej => {
						console.log('rej');
						console.log(rej);
						this.setState({
							'showError': true,
							'errorMessage': rej.errorMessage
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
				<Header />
				{formContainerJSX}
				{showErrorJSX}
				<hr className="horizontal-rule" />
				<h4 style={{fontSize:'12px', margin:'0 0 3px 0', fontWeight:'300'}}>NOTE: Someone needs to host a room before you can join it!</h4>				
				<Link to="/host" style={{color:'black'}}>host a game?</Link>
			</div>
		)
	}
}

export default Login;