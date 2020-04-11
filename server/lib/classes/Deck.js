"use strict"

function Deck() {
	this.initialize();
}

Deck.prototype.initialize = function () {
	this.cards = this.populateCards();
}

Deck.prototype.populateCards = function () {
	const cards = []
	const suits = ["club", "diamond", "heart", "spade"];

	for (let i = 0; i < suits.length; i++) {
		for (let j = 2; j <= 14; j++) {
			const card = new Card(i, j);
			cards.push(card);
		}
	}

	return cards;
};

Deck.prototype.drawCard = function () {
	const deck = this.deck;
	const index = Math.floor(Math.random() * deck.length);
	const card = deck[index];

	deck.splice(index, 1);
	return card;
}

module.exports = Deck;
