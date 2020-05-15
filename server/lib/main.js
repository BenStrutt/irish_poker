"use strict";

const Connection = require("./Connection");
const Card = require("./classes/Card");
const Deck = require("./classes/Deck");

const game = {
	phase: "lobby",
	round: 1,
	turn: 0,
	players: {},
	totalPlayers: 0,
	maxPlayers: 10,
	deck: new Deck(),
};

const connection = new Connection("localhost", 8080);
connection.connect = connect;
connection.disconnect = disconnect;
connection.reconnect = connect;
connection.receiveMessage = receiveMessage;

function connect(id) {
	if (game.phase !== "lobby" && game.players[id] === undefined) { return; }

	if (game.players[id] === undefined) {
		game.players[id] = {
			name: null,
			cards: [],
			outstandingDrinks: 0,
			totalDrinks: 0,
			drinksToGive: 0,
			guesses: [],
		};
		game.totalPlayers++;
	}

	const player = game.players[id];
	player.active = true;

	const data = getGameData();
	data.type = "initialize";
	data.id = id;
	const notIds = getPlayerIDs([id]);
	connection.broadcast(data, notIds);

	connection.sendMessage({
		type: "connect",
		id: id,
		player: player,
		totalPlayers: game.totalPlayers,
	}, notIds);
}

function disconnect(id) {
	game.players[id].active = false;
	connection.broadcast({type: "disconnect", id: id}, [id]);
}

function receiveMessage(id, data) {
	const currentPlayer = game.players[id];

	switch (data.type) {
		case "set_name":
			game.players[id].name = data.input;
			data.id = id;
			connection.broadcast(data);
			break;
		case "start":
			game.phase = "game";
			dealCards();

			connection.broadcast({
				type: "change_phase",
				value: "game",
				players: game.players
			});
			break;
		case "guess":
			const card = currentPlayer.cards[game.round - 1];
			const isCorrect = evaluateGuess[game.round](data.guess);

			if (!isCorrect) {
				currentPlayer.totalDrinks += game.round * 2;
				currentPlayer.outstandingDrinks += game.round * 2;
				game.turn++;
				if (game.turn >= game.totalPlayers) {
					game.turn = 0;
					game.round++;
					if (game.round <= 4) { dealCards(); }
				}
			} else {
				currentPlayer.drinksToGive = game.round * 2;
			}

			card.faceDown = false;
			currentPlayer.guesses.push(data.guess);

			connection.broadcast({
				type: "guess",
				id: id,
				guess: data.guess,
				card: card,
			});

			if (game.round > 4) { game.phase = "game_over"; return; }
			break;
		case "give_drink":
			game.players[data.id].outstandingDrinks++;
			game.players[data.id].totalDrinks++;
			currentPlayer.drinksToGive--;
			if (currentPlayer.drinksToGive === 0) {
				game.turn++;
				if (game.turn >= game.totalPlayers) {
					game.turn = 0;
					game.round++;
					if (game.round > 4) { game.phase = "game_over"; return; }
					dealCards();
				}
			}
			connection.broadcast({type: "receive_drink", id: data.id});
			break;
		case "take_drink":
			const outstandingDrinks = currentPlayer.outstandingDrinks
			if (outstandingDrinks === 0) { return; }

			currentPlayer.outstandingDrinks--;
			connection.broadcast({type: "took_drink", id: id});
			break;
		case "end_game":
			connection.broadcast({
				type: "change_phase",
				value: "game_over",
			});
			break;
	}
}

function getGameData() {
	return {
		phase: game.phase,
		round: game.round,
		turn: game.turn,
		players: game.players,
		totalPlayers: game.totalPlayers,
	};
}

function getPlayerIDs(exclude) {
	if (exclude === undefined) {
		exclude = [];
	}
	const ids = [];
	const players = game.players;
	for (const id in players) {
		if (exclude.indexOf(Number(id)) >= 0) { continue; }
		ids.push(Number(id));
	}

	return ids;
}

function dealCards() {
	const players = game.players;
	for (const id in players) {
		const cards = players[id].cards;
		cards.push(game.deck.drawCard());
	}
}

const evaluateGuess = {
	1: function (guess) {
		const card = game.players[game.turn].cards[0];
		return guess === card.getColor();
	},

	2: function (guess) {
		const card1 = game.players[game.turn].cards[0].value;
		const card2 = game.players[game.turn].cards[1].value;

		if (card1 === card2) { return guess === "same"; }
		if (card1 > card2) { return guess === "lower"; }
		return guess === "higher";
	},

	3: function (guess) {
		const cards = game.players[game.turn].cards;
		const values = [];
		for (let i = 0; i < 2; i++) { values.push(cards[i].value); }
		values.sort((a,b)=>a-b)

		if (cards[2].value === values[0] || cards[2].value === values[1]) { return guess === "same"; }

		if (cards[2].value > values[0] && cards[2].value < values[1]) { return guess === "inside"; }

		return guess === "outside";
	},

	4: function (guess) {
		const card = game.players[game.turn].cards[3];
		return guess === card.suit;
	},
}
