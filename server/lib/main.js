"use strict";

const Connection = require("./Connection");
const Card = require("./classes/Card");
const Deck = require("./classes/Deck");
const Player = require("./classes/Player");

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.disconnect = disconnect;
connection.receiveMessage = receiveMessage;

/**
	* @param id - number: e.g. 0
	* @param data - any: e.g. {}
	*/
function connect(id, data) {
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
}

function receiveMessage(id, data) {
	switch (data.type) {
		case "draw_card": {
			data.card = drawCardFromDeck(id);
			break;
		}
	}

}

const game = {
	round: 0,
	turn: 0,
	players: [],
	deck: new Deck(),
};
