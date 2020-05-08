"use strict"

function Card(x, y) {
	this.x = x;
	this.y = y;

	this.width = 140;
	this.height = 190;

	this.angle = 0;
	this.scaleX = 0.75;
	this.scaleY = 0.75;

	this.originScale = 0.75;

	this.suit = "";
	this.value = 0;

	this.faceDown = true;

	this.transform = new DOMMatrix();
}

Card.prototype.deserialize = function (data) {
	this.faceDown = data.faceDown

	if (this.faceDown) { return; }

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

Card.prototype.render = function (renderer) {
	const value = this.value;
	let spriteKey;
	if (this.faceDown) {
		spriteKey = "cardBack_blue5";
	} else {
		const suit = this.suit;
		const rank = value < 11 ? this.getRank() : this.getRank().charAt(0).toUpperCase();
		spriteKey = `card${suit.charAt(0).toUpperCase() + suit.slice(1, suit.length)}${rank}`;
	}

	renderer.save();

	renderer.translate(this.x, this.y);
	renderer.rotate(this.angle);
	renderer.scale(this.scaleX, this.scaleY);

	this.transform = renderer.getTransform();

	const image = assets.getImage(spriteKey);
	const width = image.width;
	const height = image.height;
	renderer.drawImage(image, -width * 0.5, -height * 0.5, width, height);

	renderer.restore();

};

Card.prototype.input = function (inputEvents) {
	const width = this.width;
	const height = this.height;

	const left = -width * 0.5;
	const right = width * 0.5;
	const top = -height * 0.5;
	const bottom = height * 0.5;

	const transform = this.transform.inverse();

	for (let i = 0; i < inputEvents.length; i++) {
		const input = inputEvents[i];

		if (
			input.type !== "mousedown" &&
			input.type !== "mousemove" &&
			input.type !== "mouseup"
		) { continue; }

		const point = transformPoint(input.x, input.y, transform);
		const _x = point.x;
		const _y = point.y;

		const isPointWithin = left <= _x && right >= _x && top <= _y && bottom >= _y;

		if (input.type === "mousedown") {
			if (isPointWithin) {
				this.pressed = true;
			}
		}

		if (input.type === "mousemove") {
			if (!this.pressed) { return; }
		}

		if (input.type === "mouseup") {
			if (!this.pressed) { return; }
			this.pressed = false;

			if (isPointWithin) {
				this.flip();
			}
		}

	}

};

Card.prototype.flip = function () {
	assets.getSound("draw").play();

	const scale = this.originScale;
	tween.create(this)
		.to({scaleX: 0}, 100)
		.call(function () {
			this.faceDown = !this.faceDown;
		}.bind(this))
		.to({scaleX: scale}, 100);
};
