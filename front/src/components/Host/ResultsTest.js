import React from 'react';
import './css/Results.css';

const submissions = [
	{
		'name': 'b',
		'socketID': 'socketID-bb',
		'entry': 'obviously ordinary[b]',
		'votes': [
			{
				'name': 'a',
				'socketID': 'socketID-a'
			}
		]
	},
	{
		'name': 'a',
		'socketID': 'socketID-aa',
		'entry': 'old oh[a]',
		'votes': [
			{
				'name': 'b',
				'socketID': 'socketID-b'
			},
			{
				'name': 'c',
				'socketID': 'socketID-c'
			}
		]
	},
	{
		'name': 'c',
		'socketID': 'socketID-c',
		'entry': 'omper odads'
	}
];

const backronym = 'oo';
const judgeSocketID = 'socketID-c';

let props = {
	'submissions': submissions,
	'backronym': backronym,
	'judgeSocketID': judgeSocketID
}

function StateResults() {

	// var firstMethod = function () {
	// 	var promise = new Promise(function (resolve, reject) {
	// 		setTimeout(function () {
	// 			console.log('first method completed');
	// 			resolve({ data: '123' });
	// 		}, 2000);
	// 	});
	// 	return promise;
	// };

	// var secondMethod = function (someStuff) {
	// 	var promise = new Promise(function (resolve, reject) {
	// 		setTimeout(function () {
	// 			console.log('second method completed');
	// 			resolve({ newData: someStuff.data + ' some more data' });
	// 		}, 2000);
	// 	});
	// 	return promise;
	// };

	// var thirdMethod = function (someStuff) {
	// 	var promise = new Promise(function (resolve, reject) {
	// 		setTimeout(function () {
	// 			console.log('third method completed');
	// 			resolve({ result: someStuff.newData });
	// 		}, 3000);
	// 	});
	// 	return promise;
	// };

	// firstMethod()
	// 	.then(secondMethod)
	// 	.then(thirdMethod);


	let displayBackronym = function () {
		var promise = new Promise (function(resolve,reject){
			setTimeout(function(){
				// console.log('display backronym');
				resolve()
			},500);
		});
		return promise;
	};
	let displayEntries = function () {
		var promise = new Promise (function(resolve,reject){
			setTimeout(function(){
				// console.log('display backronym');
				resolve()
			},300);
		});
		return promise;
	};
	let displayVotes = function () {
		var promise = new Promise (function(resolve,reject){
			setTimeout(function(){
				// console.log('display backronym');
				resolve()
			},600);
		});
		return promise;
	};	
	

	return (
		<div>
			<h1>RESULTS SCREEN</h1>
		</div>
	)
}

export default StateResults;