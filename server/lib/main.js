"use strict";

const Connection = require("./Connection");
const Card = require("./classes/Card");
const Deck = require("./classes/Deck");
const Player = require("./classes/Player");

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.reconnect = connect;
connection.receiveMessage = receiveMessage;

function connect(id, data) {

	if (game.state === "loby") {
		if (game.players[id] === undefined) {
			game.players[id] = new Player();
		}
	}

	data.state = game.state;
	data.players = game.players;

}

function receiveMessage(id, data) {
	switch (data.type) {
		case "set_name": {
			game.players[id].name = data.name;
			console.log(`SET NAME OF ID ${id} TO ${game.players[id].name}`);
			break;
		}
	}
}

const game = {
	state: "loby",
	players: {},
};
