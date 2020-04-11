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

	renderer.fillStyle = this.fgColor;
	renderer.fillText(
		this.current + (this.showCursor ? this.cursor : ""),
		x,
		y + 26,
	);
};
