"use strict";

const Connection = require("./Connection");
const Card = require("./classes/Card");
const Deck = require("./classes/Deck");
const Player = require("./classes/Player");

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.disconnect = disconnect;
connection.reconnect = connect;
connection.receiveMessage = receiveMessage;

function connect(id, data) {

	if (game.round === 0) {
		if (game.players[id] === undefined) {
			game.players[id] = new Player();
			game.players[id].positionX = ((id % 5) * 240) + 15;
			game.players[id].positionY = (Math.floor(id / 5) * 300) + 20;
		}
	}

	game.players[id].active = true;

	data.round = game.round;
	data.players = game.players;
	data.turn = game.turn;
}

function disconnect(id, data) {
	game.players[id].active = false;
	data.players = game.players;
}

function receiveMessage(id, data) {
	switch (data.type) {
		case "name": {
			game.players[id].name = data.input;
			console.log(`SET NAME OF ID ${id} TO ${game.players[id].name}`);
			break;
		}
		case "start": {
			if (id === 0) {
				game.round = 1;
				game.turn = 0;
				dealCards();

				data.players = game.players;
				console.log("game started");
			}
			break;
		}
		case "guess": {
			if (id === game.turn) {
				game.players[id].cards[game.round - 1].faceUp = true;

				if (evaluateGuess(data.guess)) {
					data.type = "correct";
				} else {
					data.type = "incorrect";
				}

				let totalPlayers = 0;
				for (id in game.players) {
					totalPlayers = id;
				}
				game.turn++
				if (game.turn > totalPlayers) {
					game.turn = 0;
					game.round++;
					dealCards();
				}

				data.turn = game.turn;
				data.round = game.round;
				data.players = game.players;
			}
			break;
		}
		case "takes": {
			game.players[id].totalDrinks += data.penalty;
			data.players = game.players;
			data.round = game.round;
			data.turn = game.turn;
			break;
		}
		case "gives": {
			game.players[data.taker] += data.penalty;
			data.players = game.players;
			data.round = game.round;
			data.turn = game.turn;
			break;
		}
	}
}

const game = {
	round: 0,
	players: {},
	deck: new Deck(),
};

function dealCards() {
	for (const id in game.players) {
		const player = game.players[id];
		player.cards.push(game.deck.drawCard());
	}
}

function evaluateGuess(guess) {
	const evalFunction = {
		1: evalRedBlack,
		2: evalHighLow,
		// 3: evalInsideOutside,
		// 4: evalSuit,
	}

	return evalFunction[game.round](guess);
}

function evalRedBlack(guess) {
	return game.players[game.turn].cards[0].getColor() === guess;
}

function evalHighLow(guess) {
	const cards = game.players[game.turn].cards;
	if (guess === "same" && cards[0].value === cards[1].value) {
		return true;
	}

	if (guess === "higher" && cards[1].value > cards[0].value) {
		return true;
	}

	if (guess === "lower" && cards[1].value < cards[0].value) {
		return true;
	}

	return false;
}

function evalInsideOutside(guess) {
	const cards = game.players[game.turn].cards;
	const values = [];
	for (let i = 0; i < 2; i++) { values.push(cards[i].value); }
	values.sort((a,b)=>a-b)

	if (guess === "same") {
		if (cards[2].value === values[0] || values[2] === values[1]) { return true; }
	}

	if (guess === "inside") {
		if (cards[2].value > values[0] && values[2] < values[1]) { return true; }
	}

	if (guess === "outside") {
		if (cards[2].value < values[0] && values[2] > values[1]) { return true; }
	}

	return false;
}
