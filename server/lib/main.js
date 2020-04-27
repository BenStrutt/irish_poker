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

function connect(id, data) {
	if (game.phase !== "lobby" && game.players[id] === undefined) { return; }

	if (game.players[id] === undefined) {
		game.players[id] = {cards: []};
		game.totalPlayers++;
	}

	game.players[id].active = true;
	data.phase = game.phase;
	data.round = game.round;
	data.turn = game.turn;
	data.players = game.players;
	data.totalPlayers = game.totalPlayers;
}

function disconnect(id, data) {
	game.players[id].active = false;
}

function receiveMessage(id, data) {
	switch (data.type) {
		case "set_name":
			game.players[id].name = data.input;
			data.players[id].name = data.input;
			break;
		case "start":
			game.phase = "game";
			data.phase = "game";
			dealCards();
			break;
	}
}

function dealCards() {
	for (const id in game.players) {
		const card = game.deck.drawCard();
		game.players[id].cards.push(card);
	}
}
