"use strict"

function Card(x, y) {
	this.x = x;
	this.y = y;

	this.width = 140;
	this.height = 190;

	this.angle = 0;
	this.scaleX = 1;
	this.scaleY = 1;

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

Card.prototype.render = function (renderer) {
	const value = this.value;
	let spriteKey;
	if (this.faceUp === false) {
		spriteKey = "cardBack_blue5";
	} else {
		const suit = this.suit;
		const rank = value < 11 ? this.getRank() : this.getRank().charAt(0).toUpperCase();
		spriteKey = `card${suit.charAt(0).toUpperCase() + suit.slice(1, suit.length)}${rank}`;
	}

	renderer.save();

	renderer.translate(this.x, this.y);
	renderer.scale(this.scaleX, this.scaleY);
	renderer.rotate(this.angle);

	const image = assets.get(spriteKey);
	const width = image.width;
	const height = image.height;
	renderer.drawImage(image, -width * 0.5, -height * 0.5, width, height);

	renderer.restore();

}
