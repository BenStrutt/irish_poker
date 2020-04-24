function Button(x, y, width, height, callback) {
	this.x = x;
	this.y = y;

	this.width = width;
	this.height = height;

	this.angle = 0;
	this.scaleX = 1;
	this.scaleY = 1;

	this.color = "#f0f";
	this.key = undefined;
	this.text = undefined;

	this.pressed = false;
	this.onPress = callback;
}

Button.prototype.input = function (inputEvents) {
	const x = this.x;
	const y = this.y;
	const width = this.width;
	const height = this.height;

	const left = x - width * 0.5;
	const right = x + width * 0.5;
	const top = y - height * 0.5;
	const bottom = y + height * 0.5;

	for (let i = 0; i < inputEvents.length; i++) {
		const input = inputEvents[i];
		if (input.type === "mousedown") {
			const _x = input.x;
			const _y = input.y;
			if (left <= _x && right >= _x && top <= _y && bottom >= _y) {
				this.pressed = true;
				this.scaleX = 1.2;
				this.scaleY = 1.2;
			}
		}
		if (input.type === "mousemove") {
			if (!this.pressed) { return; }

			const _x = input.x;
			const _y = input.y;
			if (left <= _x && right >= _x && top <= _y && bottom >= _y) {
				this.scaleX = 1.2;
				this.scaleY = 1.2;
			} else {
				this.scaleX = 1;
				this.scaleY = 1;
			}
		}
		if (input.type === "mouseup") {
			this.pressed = false;
			const _x = input.x;
			const _y = input.y;
			if (left <= _x && right >= _x && top <= _y && bottom >= _y) {
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
		const w = renderer.measureText(text).width;
		const h = parseInt(renderer.font);
		renderer.fillStyle = "#000";
		renderer.fillText(text, -w * 0.5, h * 0.3);
	}

	renderer.restore();
};
