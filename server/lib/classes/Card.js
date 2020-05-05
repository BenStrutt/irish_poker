"use strict"

function Card(suit, value) {
	this.suit = suit;
	this.value = value;
	this.faceDown = true;
}

Card.prototype.getRank = function (value) {
	if (value < 11) { return value; }

	const faceCards = ["jack", "queen", "king", "ace"];
	const index = value - 11;
	return faceCards[index];
};

Card.prototype.getColor = function () {
	return (this.suit === "diamonds" || this.suit === "hearts") ? "red" : "black";
};

module.exports = Card;
