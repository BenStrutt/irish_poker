"use strict";

function Application() {
	this.phase = "lobby";
	this.phases = {
		lobby: new Lobby(this),
		game: new Game(this),
		gameOver: new GameOver(this),
	};
}

Application.prototype.connect = function (id, data) {
	if (this.connection.id === id) { this.getGameData(data); }

	this.players[id].active = true;
};

Application.prototype.disconnect = function (id, data) {
	this.players[id].active = false;
}

Application.prototype.recieveMessage = function (id, data) {
	const phase = this.phases[this.phase];
	phase.recieveMessage(id, data);
};

Application.prototype.getGameData = function (data) {
	this.phase = data.phase;
	this.round = data.round;
	this.turn = data.turn;
	this.totalPlayers = data.totalPlayers;
	this.players = {};
	for (const id in data.players) {
		const player = new Player();
		player.deserialize(data.players[id]);
		this.players[id] = player;
	}
};

Application.prototype.drawCards = function () {
	for (const id in this.players) { this.players[id].cards.push(new Card); }
};
