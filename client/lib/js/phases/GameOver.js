"use strict";

function GameOver() {
	this.playerNames = [];
	this.currentPlayer = null;
}

GameOver.prototype.initialize = function () {
	this.currentPlayer = this.data.players[this.data.id];
	this.initializePlayerNames();
	this.setCardPositions();
}

GameOver.prototype.input = function (input) {
	for (let i = 0; i < this.playerNames.length; i++) {
		const player = this.playerNames[i];
		player.input(input, this.context);
	}
};

GameOver.prototype.process = function () {

};

GameOver.prototype.render = function (renderer) {
	for (let i = 0; i < this.playerNames.length; i++) {
		const player = this.playerNames[i];
		player.render(renderer);
	}
	this.renderStats(renderer);
	this.renderCards(renderer);
	this.renderGuesses(renderer);
};

GameOver.prototype.initializePlayerNames = function () {
	const offsetY = this.data.world.Height / (this.data.totalPlayers + 1);
	const width = this.data.world.Width;
	let currentY = offsetY;

	for (const id in this.data.players) {
		const player = this.data.players[id];
		player.nameDisplay.position(width * 0.05, currentY);
		player.nameDisplay.alignment = "left";
		player.nameDisplay.onPress = function () {
			this.currentPlayer = this.data.players[id];
			this.setCardPositions();
		}.bind(this)
		this.playerNames.push(player.nameDisplay);
		currentY += offsetY;
	}
};

GameOver.prototype.setCardPositions = function () {
	const width = this.data.world.Width;
	const height = this.data.world.Height;
	const cards = this.currentPlayer.cards;

	for (let i = 0; i < cards.length; i++) {
		cards[i].x = width * (0.35 + (i / 10));
		cards[i].y = height * 0.9;
	}
};

GameOver.prototype.renderStats = function (renderer) {

};

GameOver.prototype.renderCards = function (renderer) {
	const cards = this.currentPlayer.cards;

	for (let i = 0; i < cards.length; i++) {
		cards[i].render(renderer);
	}
};

GameOver.prototype.renderGuesses = function (renderer) {
	const player = this.currentPlayer;
	const guesses = player.guesses;
	const cards = player.cards;
	for (let i = 0; i < guesses.length; i++) {
		renderer.font = `17px Roboto, sans-serif`;
		renderer.fillStyle = "#FFF";
		renderer.textAlign = "center";
		renderer.fillText(guesses[i], cards[i].x, cards[i].y - 40);
	}
};
