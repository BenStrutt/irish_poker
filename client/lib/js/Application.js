"use strict";

function Application(initialPhase) {
	this.phase = initialPhase;
	this.phases = {};

	this.data = {};

}

Application.prototype.setAssets = function (assets) {
	this.data.assets = assets;
};

Application.prototype.setConnection = function (connection) {
	connection.receiveMessage = this.receiveMessage.bind(this);
	this.sendMessage = connection.sendMessage;
};

Application.prototype.setWorld = function (world) {
	this.data.world = world;
};

Application.prototype.setPhase = function (key, phase) {
	this.phases[key] = phase;

	phase.data = this.data;
	phase.sendMessage = this.sendMessage;

	if (this.phase !== key) { return; }

	phase.initialize({});

};

Application.prototype.input = function (input) {
	const phase = this.phases[this.phase];
	if (phase === undefined) { return; }

	phase.input(input);
};

Application.prototype.process = function (deltaTime) {
	const phase = this.phases[this.phase];
	if (phase.process === undefined) { return; }

	phase.process(deltaTime);
};

Application.prototype.render = function (context) {
	const phase = this.phases[this.phase];
	if (phase.render === undefined) { return; }

	phase.render(context);
};

Application.prototype.receiveMessage = function (data) {

	const handler = this[data.type];
	if (handler !== undefined) {
		handler.call(this, data);
	}

	const phase = this.phases[this.phase];
	if (phase.receiveMessage === undefined) { return; }

	phase.receiveMessage(data);
};

Application.prototype.initialize = function (data) {
	const localData = this.data;

	localData.id = data.id;
	localData.phase = data.phase;
	localData.round = data.round;
	localData.turn = data.turn;
	localData.totalPlayers = data.totalPlayers;

	const players = {};
	const playersData = data.players;
	for (const id in playersData) {
		const player = new Player();
		player.deserialize(playersData[id]);
		players[id] = player;
	}

	localData.players = players;
};

Application.prototype.connect = function (data) {
	this.data.players[data.id] = data.player;
	this.data.totalPlayers = data.totalPlayers;
};

Application.prototype.disconnect = function (data) {
	this.data.players[data.id].active = false;
};

Application.prototype.change_phase = function (data) {
	this.phase = data.phase;
	const phase = this.phases[this.phase];
	if (phase.initialize === undefined) { return; }
	phase.initialize(data);
};
