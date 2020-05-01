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
	switch (data.type) {
		case "set_name":
			game.players[id].name = data.input;
			data.id = id;
			connection.broadcast(data);
			break;
		case "start":
			game.phase = "game";
			connection.broadcast({type: "change_phase", value: "game"});
			break;
		case "guess": {
			// handle guess
			return;
			const card = game.deck.drawCard();

			const isCorrect = evaluateGuess(data.guess, card);

			if (!isCorrect) {
				const drinks = game.round * 2;
				data.drinks = drinks;
				game.players[id].drinks += drinks;
			}

			data.value = card;
			data.correct = isCorrect;

			game.players[id].cards.push(card);
			data.id = id;
			data.value = card;

			connection.broadcast(data);
		}
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
