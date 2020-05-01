function Button(onPressCallback) {
	this.onPress = onPressCallback;

	this.x = 0;
	this.y = 0;

	this.width = 200;
	this.height = 100;

	this.angle = 0;
	this.scaleX = 1;
	this.scaleY = 1;

	this.color = "#d9a414";
	this.key = undefined;

	this.text = undefined;
	this.font = undefined;

	this.pressed = false;

	this.transform = new DOMMatrix(); // identity matrix

}

Button.prototype.setText = function (text, font) {
	this.text = text;
	this.font = font;
};

Button.prototype.resize = function (width, height) {
	this.width = width;
	this.height = height;
};

Button.prototype.position = function (x, y) {
	this.x = x;
	this.y = y;
};

Button.prototype.input = function (inputEvents) {
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

Button.prototype.render = function (renderer) {
	renderer.save();

	renderer.translate(this.x, this.y);
	renderer.scale(this.scaleX, this.scaleY);
	renderer.rotate(this.angle);

	this.transform = renderer.getTransform();

	const width = this.width;
	const height = this.height;

	const color = this.color;
	if (color !== undefined) {
		renderer.fillStyle = color;
		renderer.fillRect(-width * 0.5, -height * 0.5, width, height);
	}

	const key = this.key;
	if (key !== undefined) {
		const image = assets.get(key);
		renderer.drawImage(image, -width * 0.5, -height * 0.5, width, height);
	}

	const text = this.text;
	if (text !== undefined) {
		const font = this.font === undefined ? "bold 15px Helvetica" : this.font;
		renderer.font = font;

		renderer.textBaseline = "middle";
		renderer.textAlign = "center";

		renderer.fillStyle = "#000";
		renderer.fillText(text, 0, 0);
	}

	renderer.restore();
};
