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

	if (game.state === "lobby") {
		if (game.players[id] === undefined) {
			game.players[id] = new Player();
		} else {
			game.players[id].active = true;
		}
	}

	data.state = game.state;
	data.players = game.players;
}

function disconnect(id, data) {
	game.players[id].active = false;
	data.players = game.players;
}

function receiveMessage(id, data) {
	switch (data.type) {
		case "set_name": {
			game.players[id].name = data.name;
			console.log(`SET NAME OF ID ${id} TO ${game.players[id].name}`);
			break;
		}
		case "round1": {
			game.state = "round1";
			console.log("game started");
			break;
		}
	}
}

const game = {
	state: "lobby",
	players: {},
};
