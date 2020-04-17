"use strict";

function Prompt(label) {
	this.label = label;

	this.x = 0;
	this.y = 0;
	this.width = 200;
	this.height = 34;

	this.current = "";
	this.cursor = "|";

	this.bgColor = "#888";
	this.fgColor = "#FFF";

	this.time = 0;
	this.timeLimit = 350;
	this.showCursor = true;
}

Promt.prototype.input = function (inputEvents) {
	const current = this.current;

	for (let i = 0; i < inputEvents.length; i++) {
		const input = inputEvents[i];

		const keyCode = input.keyCode;

		if (keyCode === 8) {
			if (current.length) {
				current = current.slice(0, -1);
			}
		} else if (keyCode === 32 || keyCode >= 65 && keyCode <= 90) {
			if (current.length < 40) { current += input.key; };
		} else if (keyCode === 13) {
			connection.sendMessage({
				type: "set_name",
				name: current,
			});
			this.current = "";
		}
	}

}

Prompt.prototype.update = function (deltaTime) {
	if ((this.time += deltaTime) >= this.timeLimit) {
		this.showCursor = !this.showCursor;
		this.time = 0;
	}
}

Prompt.prototype.render = function (renderer) {
	renderer.font = "30px Helvetica";
	const currentWidth = renderer.measureText(this.current + this.cursor).width;
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

	renderer.fillStyle = (this.current === "") ? "#a3a29d" : this.fgColor;
	let text;
	if (this.current === "") {
		text = this.label;
	} else {
		text = this.current + (this.showCursor ? this.cursor : "");
	}

	renderer.fillText(
		text,
		x,
		y + 26,
	);
};
