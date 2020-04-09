"use strict";

const Board = {
	Width: 1000,
	Height: 600,
}

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = Board.Width;
canvas.height = Board.Height;
canvas.style = "border:5px solid #3d2000;"
canvas.style.backgroundColor = "#277a2b";

document.body.appendChild(canvas);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

let keyDown;
let keyUp;

function handleKeyDown(data) {
	data.preventDefault();

	keyDown = data.code;
}

function handleKeyUp(data) {
	data.preventDefault();

	keyUp = data.code;
}

const game = {
	state: "title",

	loop: function () {
		

		switch (this.state) {
			case "title": {
				titleScreen.loop();
				break;
			}
			case "main": {
				this.mainScreen();
				break;
			}
			case "restart": {
				this.restartScreen();
				break;
			}
		}
	},

	titleScreen: {

	},
}

game.loop();
