"use strict"

function Card(suit, value) {
	this.suit = suit;
	this.value = value;
	this.color = this.setColor(suit);
	this.rank = this.setRank(value);
}

Card.prototype.setRank = function (value) {
	if (value < 11) { return value; }

	const faceCards = ["jack", "queen", "king", "ace"];
	const index = value - 11;
	return faceCards[index];
};

Card.prototype.setColor = function (suit) {
	return (suit === "diamond" || suit === "heart") ? "red" : "black";
};
