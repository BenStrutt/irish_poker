"use strict";

function Game() {
	this.data = null;
	this.state = "deal";
	this.states = {
		wait: this.wait,
		choose: this.choose,
		give: this.give,
	}
}

Game.prototype.flipCard = function (id) {
	this.data.players.cards[id].faceUp = true;
}
