"use strict";

const Connection = require("./Connection");
const Card = require("./classes/Card");
const Deck = require("./classes/Deck");
const Player = require("./classes/Player");

const connection = new Connection("localhost", 8080);

connection.connect = connect;
<<<<<<< HEAD
connection.disconnect = disconnect;
=======
connection.reconnect = connect;
>>>>>>> 70b093b7e35c2dcdbe3c2128984d91e28bbb7308
connection.receiveMessage = receiveMessage;

function connect(id, data) {
<<<<<<< HEAD
	game.players.push(new Player(id));
	data.players = game.players;
}

function disconnect(id, data) {
	for (let i = 0; i < game.players.length; i++) {
		const player = game.players[i];

		if (player.id === id) { player.active = false; }
	}
	data.players = game.players;
}

function reconnect(id, data) {
	for (let i = 0; i < game.players.length; i++) {
		const player = game.players[i];

		if (player.id === id) { player.active = false; }
	}
	data.players = game.players;
=======

	if (game.state === "loby") {
		if (game.players[id] === undefined) {
			game.players[id] = new Player();
		}
	}

	data.state = game.state;
	data.players = game.players;

>>>>>>> 70b093b7e35c2dcdbe3c2128984d91e28bbb7308
}

function receiveMessage(id, data) {
	switch (data.type) {
<<<<<<< HEAD
		case "draw_card": {
			data.card = drawCardFromDeck(id);
=======
		case "set_name": {
			game.players[id].name = data.name;
			console.log(`SET NAME OF ID ${id} TO ${game.players[id].name}`);
>>>>>>> 70b093b7e35c2dcdbe3c2128984d91e28bbb7308
			break;
		}
	}
}

const game = {
<<<<<<< HEAD
	round: 0,
	turn: 0,
	players: [],
	deck: new Deck(),
=======
	state: "loby",
	players: {},
>>>>>>> 70b093b7e35c2dcdbe3c2128984d91e28bbb7308
};
