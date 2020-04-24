"use strict"

function Card(suit, value) {
	this.suit = suit;
	this.value = value;
	this.faceUp = false;
}

Card.prototype.getRank = function (value) {
	if (value < 11) { return value; }

	const faceCards = ["jack", "queen", "king", "ace"];
	const index = value - 11;
	return faceCards[index];
};

Card.prototype.getColor = function () {
	return (this.suit === "diamond" || this.suit === "heart") ? "red" : "black";
};

module.exports = Card;
