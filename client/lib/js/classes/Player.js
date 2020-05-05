"use strict";

function Player() {
	this.x = null;
	this.y = null;

	this.angle = 0;
	this.scaleX = 0.5;
	this.scaleY = 0.5;

	this.cards = [];
	this.totalDrinks = 0;
	this.outstandingDrinks = 0;
	this.drinksToGive = 0;
	this.name = null;
	this.active = true;
	this.guesses = [];

	this.nameDisplay = new Text();
	this.uiText = new Text();
}

Player.prototype.deserialize = function(player) {
	this.cards = this.deserializeCards(player);
	this.totalDrinks = player.totalDrinks;
	this.outstandingDrinks = player.outstandingDrinks;
	this.name = player.name;
	this.active = player.active;
	this.guesses = player.guesses;
}

Player.prototype.deserializeCards = function(player) {
	const cards = []
	for (let i = 0; i < player.cards.length; i++) {
		const card = new Card();
		card.deserialize(player.cards[i]);
		cards[i] = card;
	}

	return cards;
}

Player.prototype.receiveDrinks = function (round) {
	const drinks = round * 2;
	this.totalDrinks += drinks;
	this.outstandingDrinks += drinks;
}

Player.prototype.isCorrect = function (round) {
	switch (round) {
		case 1:
			return this.guesses[0] === this.cards[0].getColor();
			break;
		case 2:
			return this.guesses[1] === this.evalHighLow();
			break;
		case 3:
			console.log(this.guesses[2]);
			console.log(this.evalInsideOutside());

			return this.guesses[2] === this.evalInsideOutside();
			break;
		case 4:
			return this.guesses[3] === this.cards[3].suit;
			break;
	}
}

Player.prototype.evalHighLow = function () {
	const card1 = this.cards[0].value;
	const card2 = this.cards[1].value;

	if (card1 === card2) {
		return "same";
	} else {
		return (card1 > card2) ? "lower" : "higher";
	}
};

Player.prototype.evalInsideOutside = function () {
	const cards = this.cards;
	const values = [];
	for (let i = 0; i < 2; i++) { values.push(cards[i].value); }
	values.sort((a,b)=>a-b)

	if (cards[2].value === values[0] || cards[2].value === values[1]) { return "same"; }

	if (cards[2].value > values[0] && cards[2].value < values[1]) { return "inside"; }

	if (cards[2].value < values[0] && cards[2].value > values[1]) { return "outside"; }
};

Player.prototype.reset = function () {
	this.cards.length = 0;
};

Player.prototype.render = function (renderer) {
	const nameDisplay = this.nameDisplay;
	nameDisplay.position(this.x, this.y - 55);
	nameDisplay.style(16, "Helvetica", "#FFF");
	nameDisplay.text = this.name;
	nameDisplay.render(renderer);

	const uiText = this.uiText;
	uiText.style(11, "Helvetica", "#FFF")

	uiText.position(this.x, this.y - 43);
	uiText.text = `Drinks to take: ${this.outstandingDrinks}`;
	uiText.render(renderer);
	uiText.position(this.x, this.y - 33);
	uiText.text = `Total drinks: ${this.totalDrinks}`;
	uiText.render(renderer);

	renderer.save();

	renderer.translate(this.x, this.y);
	renderer.rotate(this.angle);
	renderer.scale(this.scaleX, this.scaleY);

	const cards = this.cards;
	const margin = 55; // 140 is card width
	const originX = -(cards.length - 1) * margin * 0.5;
	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];
		card.x = originX + i * margin;
		card.y = 20;
		card.render(renderer);
	}

	renderer.restore();
};

Player.prototype.input = function (inputEvents) {
	const cards = this.cards;
	for (let i = 0; i < cards.length; i++) {
		cards[i].input(inputEvents);
	}
};
