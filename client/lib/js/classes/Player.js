"use strict";

function Player() {
	this.x = null;
	this.y = null;

	this.angle = 0;
	this.scaleX = 0.5;
	this.scaleY = 0.5;

	this.cards = [];
	this.totalDrinks = 0;
	this.name = null;
	this.active = true;
}

Player.prototype.deserialize = function(player) {
	this.cards = this.deserializeCards(player);
	this.totalDrinks = player.totalDrinks;
	this.name = player.name;
	this.active = player.active;
	this.x = player.x;
	this.y = player.y;
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

Player.prototype.takes = function (penalty) {
	console.log(`You take ${penalty} drinks.`)
	connection.sendMessage({type: "takes", penalty: penalty})
};

Player.prototype.gives = function (penalty) {
	console.log("Give drinks to players");
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
	this.cards.length = 0;
};

Player.prototype.render = function (renderer) {
	renderer.save();

	renderer.translate(this.x, this.y);
	renderer.rotate(this.angle);
	renderer.scale(this.scaleX, this.scaleY);

	const cards = this.cards;
	const margin = 160; // 140 is card width
	const originX = -(cards.length - 1) * margin * 0.5;
	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];
		card.x = originX + i * margin;
		card.y = 0;
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
