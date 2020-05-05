"use strict";

function Text(onPressCallback) {
	this.onPress = onPressCallback;
	this.text = null;

	this.x = null;
	this.y = null;

	this.size = null;
	this.font = null;
	this.color = null;

	this.angle = 0;
	this.scaleX = 1;
	this.scaleY = 1;

	this.pressed = false;

	this.transform = new DOMMatrix(); // identity matrix
}

Text.prototype.position = function (x, y) {
	this.x = x;
	this.y = y;
};

Text.prototype.style = function (size, font, color) {
	this.size = size;
	this.font = font;
	this.color = color;
};

Text.prototype.input = function (inputEvents, context) {
	const width = context.measureText(this.text).width;
	const height = this.size;

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
				this.scaleX = 1.2;
				this.scaleY = 1.2;
			}
		}

		if (input.type === "mousemove") {
			if (!this.pressed) { return; }

			if (isPointWithin) {
				this.scaleX = 1.2;
				this.scaleY = 1.2;
			} else {
				this.scaleX = 1;
				this.scaleY = 1;
			}
		}

		if (input.type === "mouseup") {
			if (!this.pressed) { return; }
			this.pressed = false;

			if (isPointWithin) {
				this.scaleX = 1;
				this.scaleY = 1;
				this.onPress();
			}
		}
	}
};

Text.prototype.render = function (renderer) {
	renderer.save();

	renderer.translate(this.x, this.y);
	renderer.scale(this.scaleX, this.scaleY);
	renderer.rotate(this.angle);

	this.transform = renderer.getTransform();

	renderer.font = `${this.size}px ${this.font}`;
	renderer.fillStyle = this.color;
	renderer.textBaseline = "middle";
	renderer.textAlign = "center";

	renderer.fillText(this.text, 0, 0);

	renderer.restore();
};
