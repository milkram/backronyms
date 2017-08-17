import React from 'react';
import './css/Login.css';
import { Link } from 'react-router';

function Login(props) {
	return (
		<div>
			<div id="form-container">
				<div>
					<h2 className="form-header inline-block">room code:</h2>
					<form className="no-margins inline-block">
						<input value={props.roomInput} onChange={props.updateRoomInput} />
					</form>
				</div>
				<div>
					<h2 className="form-header inline-block">your name:</h2>
					<form className="no-margins inline-block">
						<input value={props.nameInput} onChange={props.updateNameInput} />
					</form>
				</div>
				<button onClick={props.joinRoom} id="start-button"><Link to='gameplayer' id='link-join-game'>join game</Link></button>
			</div>
			<hr id="horizontal-rule" />
			<Link to="/host">host a game?</Link>
		</div>
	)
}

export default Login;