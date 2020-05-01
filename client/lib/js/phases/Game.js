"use strict";

function Game() {
	this.data = null;
	this.state = "deal";
}

Game.prototype.deal = function () {
	for (const id in this.players) { this.players[id].cards.push(new Card); }
	this.state = (this.data.turn === this.data.connection.id) ? "choose" : "wait";
};

Game.prototype.wait = function () {

};

Game.prototype.choose = function () {

};

Game.prototype.give = function () {

};
