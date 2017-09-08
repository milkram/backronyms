import React from 'react';
import './css/Header.css';

function Header(props) {
	let headerJSX = (
		<div>
			<h1 style={{ marginBottom: '0' }}>backronyms v0.1.5</h1>
			<p style={{ margin: '0' }}>the game of making something from nothing</p>
			<hr className="horizontal-rule" />
		</div>
	);

	return (
		<div>
			{headerJSX}
		</div>
	)
}

export default Header;