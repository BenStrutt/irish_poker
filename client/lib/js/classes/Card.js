"use strict"

function Card() {
	this.suit = "";
	this.value = 0;
	this.faceUp = false;
}

Card.prototype.deserialize = function (card) {
	if (card.faceUp === false) { return; }
	this.suit = card.suit;
	this.value = card.value;
	this.faceUp = card.faceUp;
};

Card.prototype.getRank = function () {
	const value = this.value;
	if (value < 11) { return value; }

	const faceCards = ["jack", "queen", "king", "ace"];
	const index = value - 11;
	return faceCards[index];
};

Card.prototype.getColor = function () {
	const suit = this.suit;
	return (suit === "diamonds" || suit === "hearts") ? "red" : "black";
};

Card.prototype.render = function (context) {
	const value = this.value;
	let spriteKey;
	if (this.faceUp === false) {
		spriteKey = "cardBack_blue5";
	} else {
		const suit = this.suit;
		const rank = value < 11 ? this.getRank() : this.getRank().charAt(0).toUpperCase();
		spriteKey = `card${suit.charAt(0).toUpperCase() + suit.slice(1, suit.length)}${rank}`;
	}

	const image = assets.get(spriteKey);
	context.drawImage(image, this.x, this.y, image.width * 0.3, image.height * 0.3);
}
