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
			game.players[id].positionX = ((id % 5) * 240) + 15;
			game.players[id].positionY = (Math.floor(id / 5) * 300) + 20;
		}
	}

	game.players[id].active = true;

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
			game.turn = 0;

			for (const id in game.players) {
				const player = game.players[id];
				player.cards.push(game.deck.drawCard());
				player.cards[0].x = player.positionX;
				player.cards[0].y = player.positionY + 15;
			}

			data.players = game.players;
			console.log("game started");
			break;
		}
	}
}

const game = {
	state: "lobby",
	players: {},
	deck: new Deck(),
};
