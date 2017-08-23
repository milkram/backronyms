import React from 'react';
// import axios from 'axios';
import './css/GamePlayer.css';
import GameLogic from '../GameLogic'
import StateLobbyPregame from './LobbyPregame'
import StateRoundStarting from './RoundStarting'
import StateRoundStartJudge from './RoundStartJudge'
import StateRoundStartPlayer from './RoundStartPlayer'
import StateRoundActiveJudge from './RoundActiveJudge'
import StateRoundActivePlayer from './RoundActivePlayer'
import StateRoundInProgress from './RoundInProgress'
import StatePlayerVoting from './PlayerVoting'

let socket = {};

class GamePlayer extends React.Component {
	constructor() {
		super();

		this.state = {
			'player': {},
			'roomCode': '',
			'gameState': 'lobbyPregame',
			'categoryChoices': [],
			'category': '',
			'backronym': '',
			'currentJudge': {},
			'submissions' : []
			// 'letterFrequencies' : {}
			// List of States:
			// ---------------------- //
			// * lobbyPregame
			// * gameStarting (game about to start, wait everyone)
			// * gameStartJudge ('you are the judge!')
			// * gameStartPlayer ('you are the player, wait up')
		}

		// Bindings
		this.setSocketListeners = this.setSocketListeners.bind(this);
		this.selectCategory = this.selectCategory.bind(this);
		this.checkForCategoryAndBackronym = this.checkForCategoryAndBackronym.bind(this);
		this.submitBackronym = this.submitBackronym.bind(this);
	}

	componentDidMount() {
		socket = this.props.socket;

		// Initialize the state
		this.setState({
			'roomCode': this.props.roomInput.toLowerCase()
		}, () => {
			// After the host socket is created, 
			this.setSocketListeners();
		})
	}

	checkForCategoryAndBackronym() {
		// If the category and the backronym fields are filled in
		//  within state, advance the game state to 'playing'
		if (this.state.backronym !== '' && this.state.category !== '') {
			this.setState({
				'gameState': 'roundInProgress'
			})
		}
	}

	setSocketListeners() {
		// When the host officially starts the game from
		//  the waiting lobby, change state to 'gameStarting'
		socket.on('host:game-intro-starting', () => {
			console.log(`>> host:game-intro-starting`);
		});

		socket.on('host:round-start', (judgeSocketID, judgeName, categoryChoices) => {
			console.log(`>> host:round-start: ${judgeSocketID}, ${judgeName}, ${JSON.stringify(categoryChoices)}`);

			// Setting the name of the judge in state
			this.setState({
				'currentJudge': {
					'name': judgeName,
					'socketID': judgeSocketID
				}
			});

			// Display a different state depending on what was
			//  randomly selected from within GameHost.js
			if (judgeSocketID === socket.id) {
				this.setState({
					'gameState': 'gameStartJudge',
					'categoryChoices': categoryChoices
				})
			}
			else {
				this.setState({
					'gameState': 'gameStartPlayer'
				})
			}
		});

		socket.on('judge:select-category', category => {
			console.log(`>> judge:select-category: ${category}`);

			this.setState({
				'category': category
			}, () => {
				this.checkForCategoryAndBackronym();
			})
		});

		socket.on('host:generate-backronym', backronym => {
			console.log(`>> host:generate-backronym: ${backronym}`)

			this.setState({
				'backronym': backronym
			}, () => {
				this.checkForCategoryAndBackronym();
			})
		});

		socket.on('host:submission-round-complete', (submissions) => {
			console.log(`>> host:submission-round-complete`);

			this.setState({
				'gameState' : 'playerVoting',
				'submissions' : submissions
			})
		})
	}

	// When the judge selects the category out of the three choices
	selectCategory(category) {
		socket.emit('judge:select-category', this.state.roomCode, category);
		this.setState({
			'category': category
		});
	}

	// When a player hands in their backronym, pass it off to
	//  GameLogic.js to see if it's approved	
	submitBackronym(event, entry, existingSubmission) {
		// Prevent default functionality of the submit button
		event.preventDefault();

		// Return a promise
		return new Promise((resolve, reject) => {
			let returnObj = GameLogic.checkBackronym(this.state.backronym, entry, existingSubmission);
			if (returnObj.valid === true) {

				// Submit to the server the verified backronym
				socket.emit('player:submit-backronym', this.state.roomCode, returnObj.entry, socket.id);

				resolve({
					'entry': returnObj.entry,
					'code': returnObj.code
				});
			}
			else {
				reject({
					'valid': false,
					'message': returnObj.message,
					'code': returnObj.code
				});
			}
		})
	}

	render() {
		let toRender;
		switch (this.state.gameState) {
			default: {
				toRender = <div>default, fix this</div>
				break;
			}
			case 'lobbyPregame': {
				toRender = <StateLobbyPregame />
				break;
			}
			case 'gameStarting': {
				toRender = <StateRoundStarting />
				break;
			}
			case 'gameStartJudge': {
				toRender = <StateRoundStartJudge categoryChoices={this.state.categoryChoices} selectCategory={this.selectCategory} />
				break;
			}
			case 'gameStartPlayer': {
				toRender = <StateRoundStartPlayer judgeName={this.state.currentJudge.name} />
				break;
			}
			case 'gameActiveJudge': {
				toRender = <StateRoundActiveJudge category={this.state.category} />
				break;
			}
			case 'gameActivePlayer': {
				toRender = <StateRoundActivePlayer judgeName={this.state.currentJudge.name} />
				break;
			}
			case 'roundInProgress': {
				toRender = <StateRoundInProgress socketID={socket.id} judge={{ 'name': this.state.currentJudge.name, 'socketID': this.state.currentJudge.socketID }} category={this.state.category} backronym={this.state.backronym} submitBackronym={this.submitBackronym} />
				break;
			}
			case 'playerVoting' : {
				toRender = <StatePlayerVoting submissions={this.state.submissions}/>
				break;
			}
		}
		return (
			<div>
				{toRender}
			</div>
		)
	}
}
export default GamePlayer;