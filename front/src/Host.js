import React from 'react';
import { Link } from 'react-router';
import './css/Host.css';
import Header from './components/Header';

function Home (props) {
	return (
		<div>
			<Header />
			<div id="form-container">
				<div>
					<button onClick={props.startHosting} id="start-button"><Link to='gamehost' id='link-start-game' style={{color:'black'}}>start hosting</Link></button>
					<h4 style={{width:'30%', margin:'12px auto 0 auto', fontSize:'12px',fontWeight:'100'}}>host a game on a separate tab, then have your players join via their phones or computers with the room code from the next screen</h4>
				</div>
			</div>
			<hr id="horizontal-rule" />
			<Link to="/" style={{color:'black'}}>join a game?</Link>
		</div>
	)
}

export default Home;