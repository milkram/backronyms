import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Login from './Login';
import Host from './Host';
import GameHost from './components/Host/GameHost';
import GamePlayer from './components/Player/GamePlayer';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

// TEST
// import StateResultsTest from './components/Host/ResultsTest'
// ReactDOM.render(<Router history={browserHistory}>
// 					<Route path="test" component={StateResultsTest} />
// 					<Route path="/" component={App}>
// 						<IndexRoute component={Login} />
// 						<Route path="/" component={Login} />
// 						<Route path="host" component={Host} />
// 						<Route path="gamehost" component={GameHost} />
// 						<Route path="gameplayer" component={GamePlayer} />
// 					</Route>
// 				</Router>, document.getElementById('root'));
				
// registerServiceWorker();


// REAL
ReactDOM.render(<Router history={browserHistory}>
	<Route path="/" component={App}>
		<IndexRoute component={Login} />
		<Route path="/" component={Login} />
		<Route path="host" component={Host} />
		<Route path="gamehost" component={GameHost} />
		<Route path="gameplayer" component={GamePlayer} />
	</Route>
</Router>, document.getElementById('root'));

registerServiceWorker();