"use strict"

function Card(x, y) {
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.scaleX = 0.4;
	this.scaleY = 0.4;

	this.suit = "";
	this.value = 0;
	this.faceUp = false;
}

Card.prototype.deserialize = function (data) {
	this.suit = data.suit;
	this.value = data.value;
	this.faceUp = data.faceUp;
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

	context.translate(this.x, this.y);
	context.scale(this.scaleX, this.scaleY);
	context.rotate(this.angle);

	const image = assets.get(spriteKey);
	const width = image.width;
	const height = image.height;
	context.drawImage(image, -width * 0.5, -height * 0.5, width, height);

	context.resetTransform();
}
