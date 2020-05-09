"use strict";

function GameOver() {
	this.playerNames = [];
}

GameOver.prototype.initialize = function () {
	

	test.position(width * 0.5, height * 0.5);
	test.style(15, "Helvetica", "#FFF");
	test.text = "Test game over screen";
}

GameOver.prototype.input = function () {

};

GameOver.prototype.process = function () {

};

GameOver.prototype.render = function (renderer) {
	this.test.render(renderer);
};
