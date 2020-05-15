"use strict";

function Prompt(onSubmitCallback) {
	this.onSubmit = onSubmitCallback;

	this.label = undefined;

	this.x = 0;
	this.y = 0;
	this.width = 200;
	this.height = 34;

	this.text = "";
	this.font = "30px Roboto, sans-serif";
	this.cursor = "|";

	this.bgColor = "#888";
	this.fgColor = "#FFF";

	this.time = 0;
	this.timeLimit = 350;
	this.showCursor = true;

}

Prompt.prototype.setText = function (text, font) {
	this.text = text;
	this.font = font;
};

Prompt.prototype.resize = function (width, height) {
	this.width = width;
	this.height = height;
};

Prompt.prototype.position = function (x, y) {
	this.x = x;
	this.y = y;
};

Prompt.prototype.input = function (inputEvents) {
	const current = this.text;

	for (let i = 0; i < inputEvents.length; i++) {
		const input = inputEvents[i];

		const keyCode = input.keyCode;

		if (keyCode === 8) {
			if (current.length) {
				this.text = current.slice(0, -1);
			}
		} else if (keyCode === 32 || keyCode >= 65 && keyCode <= 90) {
			if (current.length < 20) { this.text += input.key; };
		} else if (keyCode === 13) {
			if (this.text === "") { return; }

			this.onSubmit(this.text);
			this.text = "";
		}
	}

}

Prompt.prototype.process = function (deltaTime) {
	if ((this.time += deltaTime) >= this.timeLimit) {
		this.showCursor = !this.showCursor;
		this.time = 0;
	}
}

Prompt.prototype.render = function (renderer) {
	renderer.font = this.font;
	const currentWidth = renderer.measureText(this.text + this.cursor).width;
	if (currentWidth > 200) {
		this.width = currentWidth;
	} else {
		this.width = 200;
	}
	const height = this.height;
	const width = this.width;
	const x = this.x - width * 0.5;
	const y = this.y - height * 0.5;

	renderer.fillStyle = this.bgColor;
	renderer.fillRect(x, y, width, height);

	renderer.fillStyle = (this.text === "") ? "#a3a29d" : this.fgColor;
	let text;
	if (this.text === "") {
		text = this.label;
	} else {
		text = this.text + (this.showCursor ? this.cursor : "");
	}

	renderer.textBaseline = "alphabetic";
	renderer.textAlign = "start";
	renderer.fillText(
		text,
		x,
		y + 26,
	);
};
