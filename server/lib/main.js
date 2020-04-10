"use strict";

const Connection = require("./Connection");
const Card = require("./classes/Card");
const Deck = require("./classes/Deck");
const Player = require("./classes/Player");

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.receiveMessage = receiveMessage;

/**
	* @param id - number: e.g. 0
	* @param data - any: e.g. {}
	*/
function connect(id, data) {
	data.names = game.names;
	data.round = game.round;
	data.turn = game.turn;
	data.hands = game.hands;
}

function receiveMessage(id, data) {
	switch (data.type) {
		case "draw_card": {
			data.card = drawCardFromDeck(id);
		}
	}

}

const game = {
	round: 0,
	turn: 0,
	names: {
		["0"]: "Ben",
		["1"]: "Chris",
	},
	hands: [[0,1], [0,3]],
	deck: [0, 1]
};
