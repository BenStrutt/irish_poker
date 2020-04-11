"use strict";

function Player(id) {
	this.id = id;
	this.active = true;
	this.cards = [];
	this.totalDrinks = 0;
	this.name = null;
}

Player.prototype.takes = function (penalty) {
	this.totalDrinks += penalty;
};

Player.prototype.gives = function (penalty) {

};

Player.prototype.evalHighLow = function () {
	const card1 = this.cards[0].value;
	const card2 = this.cards[1].value;

	if (card1 === card2) {
		return "same";
	} else {
		return (card1 > card2) ? "higher" : "lower";
	}
};

Player.prototype.evalInsideOutside = function () {
	const cards = this.cards;

	let lowest = cards[0].value;
	let highest = cards[0].value;
	for (let i = 0; i < 2; i++) {
		if (cards[i].value > highest) { highest = cards[i].value }
		if (cards[i].value < lowest) { lowest = cards[i].value }
	}

	if (cards[2] === lowest || cards[2] === highest) {
		return "same";
	} else {
		return (cards[2] > highest && cards[2] < lowest) ? "outside" : "inside";
	}
};

Player.prototype.reset = function () {
	this.cards = [];
};
