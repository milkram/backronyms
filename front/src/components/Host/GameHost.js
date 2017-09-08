import React from 'react';
import axios from 'axios';
import StateListeningForConnections from './ListeningForConnections'
import StateGameIntro from './GameIntro'
import StateRoundStart from './RoundStart'
import StateVoting from './Voting'
import StateResults from './Results'
import StateScoreTally from './ScoreTally'
import StateNewRoundIdle from './NewRoundIdle'
import GameLogic from '../GameLogic'

// import { Link } from 'react-router';
// import Player from './components/Player'

let socket = {};

class GameHost extends React.Component {
	constructor() {
		super();

		this.state = {
			'room': {},
			'gameState': 'listeningForConnections',
			'letterFrequencies': {},
			'categories': [],
			'categoryHead': 0,
			'currentRound': {
				'round': 0,
				'score': [
					// {
					// 'name': '',
					// 'socketID': '',
					// 'score': 0
					// }
				],
				'judge': {
					// 'name': '',
					// 'socketID': ''
				},
				'backronym': '',
				'category': '',
				'submissions': [
					// {
					// 'name': '',
					// 'socketID': '',
					// 'entry': '',
					// 'votes': [
					// 	{
					// 		'name': '',
					// 		'socketID': ''
					//		'isJudge': ''
					// 	}
					// ]
					// }
				],
			},
			'history': []

			// List of States:
			// ---------------------- //
			// * listeningForConnections
			// * gameIntro
			// * 
		}

		// Properties
		this.timerCompletePassthrough = true;
		this.votingTimerCompletePassthrough = true;
		this.resultsTimerCompletePassthrough = true;
		this.scoreTallyTimerCompletePassthrough = true;

		// Bindings
		this.setSocketListeners = this.setSocketListeners.bind(this);
		this.startGame = this.startGame.bind(this);
		this.startNewRound = this.startNewRound.bind(this);
		this.getCategories = this.getCategories.bind(this);
		this.getLetterFrequencies = this.getLetterFrequencies.bind(this);
		this.timerComplete = this.timerComplete.bind(this);
		this.votingTimerComplete = this.votingTimerComplete.bind(this);
		this.resultsTimerComplete = this.resultsTimerComplete.bind(this);
		this.scoreTallyTimerComplete = this.scoreTallyTimerComplete.bind(this);
		this.updateScores = this.updateScores.bind(this);
	}

	componentDidMount() {
		socket = this.props.socket;

		// Initialize the state
		this.setState({
			'room': {
				'roomCode': '',
				'host': '',
				'players': []
			}
		}, () => {
			// After the host socket is created
			this.setSocketListeners();
		})

		// Fetch the categories from the server
		this.getCategories();

		// Fetch the current letter frequencies from the server
		this.getLetterFrequencies();
	}

	getCategories() {
		// axios.get('http://localhost:3100/categories')
		axios.get('/categories')
			.then(res => {
				this.setState({
					'categories': GameLogic.shuffleCategories(res.data)
				});
			});
	}

	getLetterFrequencies() {
		// axios.get('http://localhost:3100/letterfreqs')
		axios.get('/letterfreqs')
			.then(res => {
				this.setState({
					'letterFrequencies': res.data
				})
			})
	}

	timerComplete() {
		// This method is called either when the timer has hit 0 seconds and not all submissions were submitted,
		//  or all of the submissions were submitted before the timer was actually complete,
		//  which will call this method as well

		if (this.timerCompletePassthrough === true) {

			// Prevents double triggers of this method			
			this.timerCompletePassthrough = false;

			socket.emit('host:submission-round-complete', this.state.room.roomCode, this.state.currentRound.submissions, this.state.room.players.length);

			// Change the state/view to the voting round
			this.setState({
				'gameState': 'voting'
			})
		}
	}

	votingTimerComplete() {
		// This method is called either when the timer has hit 0 seconds and not all votes were submitted,
		//  or all of the votes were submitted before the timer was actually complete,
		//  which will call this method as well

		if (this.votingTimerCompletePassthrough === true) {
			// Prevents double triggers of this method
			this.votingTimerCompletePassthrough = false;

			socket.emit('host:voting-round-complete', this.state.room.roomCode, this.state.currentRound.submissions, this.state.room.players.length);

			// Update the scores
			this.updateScores();

			// Change the state/view to the voting round
			this.setState({
				'gameState': 'results'
			})
		}
	}

	updateScores() {

		// console.log("update scores");

		// console.log("ah");
		// console.log(this.state.currentRound.score);		

		// Update the scores
		let modifiedCurrentRound = this.state.currentRound;
		let modifiedSubmissions = modifiedCurrentRound.submissions; // array
		let modifiedScore = modifiedCurrentRound.score; // array of objects
		let submissionIndexThatJudgeVotedFor = 0;

		// Verifying that the socketIDs match, and then allocatting the respective points
		//  to their score
		for (let i = 0; i < modifiedScore.length; i++) {
			for (let ii = 0; ii < modifiedSubmissions.length; ii++) {
				if (modifiedScore[i].socketID === modifiedSubmissions[ii].socketID) {
					for (let iii = 0; iii < modifiedSubmissions[ii].votes.length; iii++) {
						if (modifiedSubmissions[ii].votes[iii].isJudge === true) {
							// If the player received any votes from the judge, they get 4000pts
							modifiedScore[i].score += 4000;

							// Record the index that judge voted for
							submissionIndexThatJudgeVotedFor = ii;
						}
						else if (modifiedScore[i].socketID === modifiedCurrentRound.judge.socketID) {
							// If the player received any votes as the judge, they get 2000pts per vote
							modifiedScore[i].score += 2000;
						}
						else {
							// Else if the player received votes neither as the nudge nor from the judge,
							//  they receive 1000pts per vote
							modifiedScore[i].score += 1000;
						}
					}
				}
			}
		}

		// Allocate bonus points via agreeing with the judge (+2000pts)
		let bonusPoints = [];
		for (let i = 0; i < modifiedSubmissions[submissionIndexThatJudgeVotedFor].votes.length; i++) {
			if (modifiedSubmissions[submissionIndexThatJudgeVotedFor].votes[i].isJudge !== true) {
				bonusPoints.push(modifiedSubmissions[submissionIndexThatJudgeVotedFor].votes[i]);
			}
		}
		for (let i = 0; i < modifiedScore.length; i++) {
			for (let ii = 0; ii < bonusPoints.length; ii++) {
				if (modifiedScore[i].socketID === bonusPoints[ii].socketID) {
					modifiedScore[i].score += 2000;
				}
			}
		}
		modifiedCurrentRound.score = modifiedScore;

		// Save the scores
		this.setState({
			'currentRound': modifiedCurrentRound
		})
	}

	resultsTimerComplete() {
		// When the bar timer is complete from the Results screen
		if (this.resultsTimerCompletePassthrough === true) {
			// Prevents double triggers of this method
			this.resultsTimerCompletePassthrough = false;

			// No need to transmit anything here, we can go straight into the score tally screen
			// We'll move into the next round for next transmission

			// Change the state/view to the voting round
			this.setState({
				'gameState': 'scoreTally'
			})
		}
	}

	scoreTallyTimerComplete() {
		// This method is called either when the timer has hit 0 seconds and not all votes were submitted,
		//  or all of the votes were submitted before the timer was actually complete,
		//  which will call this method as well

		if (this.scoreTallyTimerCompletePassthrough === true) {
			// Prevents double triggers of this method
			this.scoreTallyTimerCompletePassthrough = false;

			// Trigger a new round
			this.startNewRound();
		}
	}

	startGame() {
		// First time the game is starting -- initialize some values into state
		this.setState({
			'gameState': 'gameIntro',
		}, () => {
			socket.emit('host:game-intro-starting', this.state.room.roomCode);

			// Transition into the start game logic,
			//  with a 3000ms delay in between -- deprecated

			// Selecting a new judge, at random (should probably be controlled random for later)
			let newJudge = this.state.room.players[Math.floor(Math.random() * this.state.room.players.length)];

			// Determine the category choices for the new judge
			let categoryChoices = GameLogic.presentCategoryChoices(this.state.categories, this.state.categoryHead);

			// Figuring out who the judge is, and offering that device the three category choices
			socket.emit('host:round-start', this.state.room.roomCode, newJudge.socketID, newJudge.name, categoryChoices);

			// Save the judge into state
			let modifiedCurrentRound = this.state.currentRound;
			modifiedCurrentRound.judge.name = newJudge.name;
			modifiedCurrentRound.judge.socketID = newJudge.socketID;

			// Create a new score-card and add to modifiedCurrentRound
			let newScore = [];
			for (let i = 0; i < this.state.room.players.length; i++) {
				let scoreObj = {
					'name': this.state.room.players[i].name,
					'socketID': this.state.room.players[i].socketID,
					'score': 0
				}
				newScore.push(scoreObj);
			}
			modifiedCurrentRound.score = newScore;

			// Set the round number to 1 (since new game)
			modifiedCurrentRound.round = 1;

			// Save judge + category head + scoreCard
			this.setState({
				'categoryHead': this.state.categoryHead + 3,
				currentRound: modifiedCurrentRound
			})
		});
	}

	startNewRound() {
		// Not the first time game is starting -- update state values
		let previousRound = this.state.currentRound;
		let modifiedHistory = this.state.history;

		// Save the values that need to be carried over (round number and score)
		let newRoundNumber = this.state.currentRound.round + 1;
		let newScore = this.state.currentRound.score;

		// Push the previous round onto the round history
		modifiedHistory.push(previousRound);

		// Reseting timer properties
		this.timerCompletePassthrough = true;
		this.votingTimerCompletePassthrough = true;
		this.resultsTimerCompletePassthrough = true;
		this.scoreTallyTimerCompletePassthrough = true;

		// Create a fresh/new 'currentRound' object
		this.setState({
			'gameState': 'gameIntro',
			'currentRound': {
				'round': newRoundNumber,
				'score': newScore,
				'judge': {},
				'backronym': '',
				'category': '',
				'submissions': []
			}
		}, () => {
			// Selecting a new judge, at random (should probably be controlled random for later)
			let newJudge = this.state.room.players[Math.floor(Math.random() * this.state.room.players.length)];

			// Determine the category choices for the new judge
			let categoryChoices = GameLogic.presentCategoryChoices(this.state.categories, this.state.categoryHead);

			// Figuring out who the judge is, and offering that device the three category choices
			socket.emit('host:round-start', this.state.room.roomCode, newJudge.socketID, newJudge.name, categoryChoices);

			// Save the judge into state
			let modifiedCurrentRound = this.state.currentRound;
			modifiedCurrentRound.judge.name = newJudge.name;
			modifiedCurrentRound.judge.socketID = newJudge.socketID;

			// Create a new score-card and add to modifiedCurrentRound
			// let newScore = [];
			// for (let i = 0; i < this.state.room.players.length; i++) {
			// 	let scoreObj = {
			// 		'name': this.state.room.players[i].name,
			// 		'socketID': this.state.room.players[i].socketID,
			// 		'score': 0
			// 	}
			// 	newScore.push(scoreObj);
			// }
			// modifiedCurrentRound.score = newScore;

			// Set the round number to 1 (since new game)
			// modifiedCurrentRound.round = 1;

			// Save judge + category head + scoreCard
			this.setState({
				'categoryHead': this.state.categoryHead + 3,
				currentRound: modifiedCurrentRound
			})
		})
	}

	setSocketListeners() {

		// When the room is freshly made...
		socket.on('host:make-room', roomCode => {
			console.log(`>> host:make-room: ${roomCode}`);

			// Fetch the room object and the 'players' array within
			let modifiedRoom = this.state.room;
			modifiedRoom.roomCode = roomCode.toLowerCase();
			modifiedRoom.host = socket.id;

			// Save state of room
			this.setState({
				room: modifiedRoom
			})
		})

		// When a new player has joined into the game, 
		//  add their information into this room's data
		socket.on('host:join-room-success', data => {
			console.log('>> host:join-room-success: ' + data.name + ' joined in!');

			// Fetch the room object and the 'players' array within
			let modifiedRoom = this.state.room;
			let modifiedPlayers = this.state.room.players;

			// In the 'players' array, add the new incoming player info
			modifiedPlayers.push({
				name: data.name,
				socketID: data.socket
			})
			// In the parent 'room' object, add in the modifiedPlayers array
			// modifiedRoom.roomCode = this.props.roomCode.toLowerCase();
			// modifiedRoom.host = socket.id;
			modifiedRoom.players = modifiedPlayers;

			// Set to state the newly modifiedRoom
			this.setState({
				room: modifiedRoom
			});
		});

		// When the judge selects a category, display it...
		socket.on('judge:select-category', category => {
			console.log(`>> judge:select-category: ${JSON.stringify(category)}`);

			// Generate the backronym for the round
			let backronym = GameLogic.generateBackronym(this.state.letterFrequencies);
			socket.emit('host:generate-backronym', this.state.room.roomCode, backronym);

			// Save the category + the backronym into 'currentRound'
			let modifiedCurrentRound = this.state.currentRound;
			modifiedCurrentRound.category = category;
			modifiedCurrentRound.backronym = backronym;

			this.setState({
				gameState: 'roundStart',
				currentRound: modifiedCurrentRound
			})
		});

		// When a player submits a verified backronym, display it...
		socket.on('player:submit-backronym', (backronym, socketID) => {
			console.log(`>> player:submit-backronym: ${backronym}`);

			// Loop through all of the players in the room to find out their player name
			let playerName = '';
			for (let i = 0; i < this.state.room.players.length; i++) {
				if (this.state.room.players[i].socketID === socketID) {
					playerName = this.state.room.players[i].name;
				}
			}

			// Fetch the currentRound.submissions array and add to it
			let modifiedCurrentRound = this.state.currentRound;
			let modifiedSubmissions = this.state.currentRound.submissions;

			// Loop through all of the existing submissions --
			//  if there's a match, _replace_ instead of push
			let doPush = true;
			for (let i = 0; i < modifiedSubmissions.length; i++) {
				if (modifiedSubmissions[i].socketID === socketID) {
					doPush = false;
					modifiedSubmissions.splice(i, 1, {
						'name': playerName,
						'socketID': socketID,
						'entry': backronym,
						'votes': []
					})
				}
			}

			// Add the entry to the submissions array, IF
			//  there's not a match of sockets - in which case
			//  replace instead
			if (doPush) {
				modifiedSubmissions.push({
					'name': playerName,
					'socketID': socketID,
					'entry': backronym,
					'votes': []
				})
			}

			// Add the submissions array to the currentRound
			modifiedCurrentRound.submissions = modifiedSubmissions;

			this.setState({
				'currentRound': modifiedCurrentRound
			}, () => {

				// If all of the players have submitted answers, immediately call timerComplete()
				if (this.state.currentRound.submissions.length === this.state.room.players.length) {
					this.timerComplete();
				}
			});
		});

		// When a player submits a vote...
		socket.on('player:submit-vote', (index, name, socketID) => {

			// Pull the submissions from state and modify it
			let modifiedCurrentRound = this.state.currentRound;
			let modifiedSubmissions = modifiedCurrentRound.submissions; // array
			let modifiedSubmission = modifiedSubmissions[index]; // object
			let modifiedVotes = modifiedSubmission.votes; // array

			// Modify the information and place back into state
			modifiedVotes.push({
				'name': name,
				'socketID': socketID,
				'isJudge': (this.state.currentRound.judge.socketID === socketID) ? true : false
			})
			modifiedSubmission.votes = modifiedVotes;
			modifiedSubmissions.splice(index, 1, modifiedSubmission);

			// Save state
			this.setState({
				submissions: modifiedSubmissions
			}, () => {
				// console.log(this.state.submissions);

				// If all of the players have submitted votes, immediately call votingTimerComplete()
				let numberOfVotes = 0;
				let submissions = this.state.currentRound.submissions;
				for (let i = 0; i < submissions.length; i++) {
					numberOfVotes += submissions[i].votes.length;
				}
				if (numberOfVotes === this.state.room.players.length) {
					this.votingTimerComplete();
				}
			})
		});
	}

	render() {
		let toRender;
		switch (this.state.gameState) {
			default: {
				toRender = <div>default, fix this</div>
				break;
			}
			case 'listeningForConnections': {
				toRender = <StateListeningForConnections room={this.state.room} startGame={this.startGame} />
				break;
			}
			case 'gameIntro': {
				toRender = <StateGameIntro round={this.state.currentRound} />
				break;
			}
			case 'roundStart': {
				toRender = (
					<StateRoundStart category={this.state.currentRound.category} backronym={this.state.currentRound.backronym} timerComplete={this.timerComplete} judgeName={this.state.currentRound.judge.name} submissions={this.state.currentRound.submissions} />
				)
				break;
			}
			case 'voting': {
				toRender = (
					<StateVoting round={this.state.currentRound} votingTimerComplete={this.votingTimerComplete} />
				)
				break;
			}
			case 'results': {
				toRender = (
					<StateResults submissions={this.state.submissions} backronym={this.state.currentRound.backronym} judgeSocketID={this.state.currentRound.judge.socketID} resultsTimerComplete={this.resultsTimerComplete} />
				)
				break;
			}
			case 'scoreTally': {
				toRender = (
					<StateScoreTally round={this.state.currentRound} scoreTallyTimerComplete={this.scoreTallyTimerComplete} />
				)
				break;
			}
			case 'newRoundIdle': {
				toRender = (
					<StateNewRoundIdle />
				)
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
export default GameHost;