"use strict"

function Card() {
	this.x = 0;
	this.y = 0;

	this.suit = "";
	this.value = 0;
}

Card.prototype.deserialize = function (data) {
	this.suit = data.suit;
	this.value = data.value;
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
	if (value === 0) {
		spriteKey = "cardBack_blue5";
	} else {
		const suit = this.suit;
		const rank = value < 11 ? this.getRank() : this.getRank().charAt(0).toUpperCase();
		spriteKey = `card${suit.charAt(0).toUpperCase() + suit.slice(1, suit.length)}${rank}`;
	}

	const image = assets.get(spriteKey);
	context.drawImage(image, this.x, this.y, image.width * 0.5, image.height * 0.5);
}
