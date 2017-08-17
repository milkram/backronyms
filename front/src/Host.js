import React from 'react';
import { Link } from 'react-router';
import './css/Host.css';

function Home (props) {
	return (
		<div>
			<div id="form-container">
				<div>
					<h2 className="form-header inline-block">room code:</h2>
					<h2 className="no-margins inline-block">{props.roomCode}</h2>
					<button onClick={props.setNewRoomCode} id="change-room-code-button">change room code</button>
					{/* <button id="start-button"><Link to='gamehost' id='link-start-game'>start hosting</Link></button> */}
					<button onClick={props.startHosting} id="start-button"><Link to='gamehost' id='link-start-game'>start hosting</Link></button>					
					{/* <button onClick={props.startHosting} id="start-button">start hosting</button> */}
				</div>
			</div>
			<hr id="horizontal-rule" />
			<Link to="/">join a game?</Link>
		</div>
	)
}

export default Home;