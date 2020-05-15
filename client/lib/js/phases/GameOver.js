"use strict";

function GameOver() {
	this.playerNames = [];
	this.currentPlayer = null;

	this.playAgain = new Text();
	this.yes = new Button(this.startGame.bind(this));
	this.no = new Button();
}

GameOver.prototype.startGame = function () {
	this.sendMessage({type: "start"});
};

GameOver.prototype.initialize = function () {
	this.currentPlayer = this.data.players[this.data.id];
	this.initializePlayerNames();
	this.setCardPositions();

	if (!this.canRestart()) { return; }

	const width = this.data.world.Width;
	const height = this.data.world.Height;

	const playAgain = this.playAgain;
	playAgain.text = "PLAY AGAIN?";
	playAgain.style(25, "Roboto, sans-serif", "#FFF");
	playAgain.position(width * 0.5, height * 0.4);

	const yes = this.yes;
	yes.color = "#080";
	yes.resize(201, 101);
	yes.setText("YES!", "25px Roboto, sans-serif");
	yes.position(width * 0.5 - 100, height * 0.5);

	const no = this.no;
	no.color = "#800";
	no.resize(201, 101);
	no.setText("NO", "25px Roboto, sans-serif");
	no.position(width * 0.5 + 100, height * 0.5);

}

GameOver.prototype.input = function (input) {
	for (let i = 0; i < this.playerNames.length; i++) {
		const player = this.playerNames[i];
		player.input(input, this.context);
	}

	if (!this.canRestart()) { return; }

	this.yes.input(input);
	this.no.input(input);
};

GameOver.prototype.canRestart = function () {
	return this.data.id === 0;
}

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
	this.renderPlayAgain(renderer);

};

GameOver.prototype.renderPlayAgain = function (renderer) {
	this.playAgain.render(renderer);
	this.yes.render(renderer);
	this.no.render(renderer);
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
