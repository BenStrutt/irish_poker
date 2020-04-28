"use strict";

function Application(initialPhase) {
	this.data = {
		id: null,
	};

	this.phase = initialPhase;
	this.phases = {};

}

Application.prototype.getID = function () {
	return this.connection.id;
};

Application.prototype.setAssets = function (assets) {
	this.data.assets = assets;
};

Application.prototype.setConnection = function (connection) {
	connection.connect = this.connect;
	connection.disconnect = this.disconnect;
	connection.reconnect = this.reconnect;
	connection.receiveMessage = this.receiveMessage;
	this.sendMessage = connection.sendMessage;
};

Application.prototype.setConnection = function (board) {
	this.data.board = board;
};

Application.prototype.addPhase = function (key, phase) {
	this.phases[key] = phase;

	phase.data = this.data;
	phase.sendMessage = this.sendMessage;
};

Application.prototype.input = function (input) {
	const phase = this.phases[this.phase];
	if (phase.input === undefined) { return; }

	phase.input(input);
};

Application.prototype.process = function (deltaTime) {
	const phase = this.phases[this.phase];
	if (phase.process === undefined) { return; }

	phase.process(deltaTime);
};

Application.prototype.render = function (renderer) {
	const phase = this.phases[this.phase];
	if (phase.render === undefined) { return; }

	phase.render(renderer);
};

Application.prototype.connect = function (id, data) {
	if (this.data.id === null) { this.data.id = id; }

	const phase = this.phases[this.phase];
	if (phase.connect === undefined) { return; }

	phase.connect(id, data);
};

Application.prototype.diconnect = function (id, data) {
	const phase = this.phases[this.phase];
	if (phase.diconnect === undefined) { return; }

	phase.diconnect(id, data);
};

Application.prototype.reconnect = function (id, data) {
	const phase = this.phases[this.phase];
	if (phase.reconnect === undefined) { return; }

	phase.reconnect(id, data);
};

Application.prototype.recieveMessage = function (id, data) {
	const phase = this.phases[this.phase];
	if (phase.recieveMessage === undefined) { return; }

	phase.recieveMessage(id, data);
};

Application.prototype.addNewPlayer = function (id, data) {
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

Application.prototype.initializeGameData = function (data) {
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
