"use strict"

const Card = require("./Card");

function Deck() {
	this.initialize();
}

Deck.prototype.initialize = function () {
	this.cards = this.populateCards();
}

Deck.prototype.populateCards = function () {
	const cards = []
	const suits = ["clubs", "diamonds", "hearts", "spades"];

	for (let i = 0; i < suits.length; i++) {
		for (let j = 2; j <= 14; j++) {
			const card = new Card(suits[i], j);
			cards.push(card);
		}
	}

	return cards;
};

Deck.prototype.drawCard = function () {
	const index = Math.floor(Math.random() * this.cards.length);
	const card = this.cards[index];

	this.cards.splice(index, 1);
	return card;
}

module.exports = Deck;
