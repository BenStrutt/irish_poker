"use strict";

function Application(initialPhase) {
	this.data = {};

	this.data.phase = initialPhase;
	this.data.phases = {};

}

Application.prototype.setAssets = function (assets) {
	this.data.assets = assets;
};

Application.prototype.setConnection = function (connection) {
	this.data.connection = connection;
	connection.connect = this.connect.bind(this);
	connection.disconnect = this.disconnect.bind(this);
	connection.reconnect = this.reconnect.bind(this);
	connection.receiveMessage = this.receiveMessage.bind(this);
	this.sendMessage = connection.sendMessage;
};

Application.prototype.setWorld = function (world) {
	this.data.world = world;
};

Application.prototype.setCanvas = function (canvas) {
	canvas.width = this.data.world.Width;
	canvas.height = this.data.world.Height;
	canvas.style.backgroundColor = "#277a2b";

	this.data.context = canvas.getContext("2d");
}

Application.prototype.setPhase = function (key, phase) {
	this.data.phases[key] = phase;

	phase.data = this.data;
	phase.sendMessage = this.sendMessage;
};

Application.prototype.input = function (input) {
	const phase = this.data.phases[this.data.phase];
	if (phase === undefined) { return; }

	phase.input(input);
};

Application.prototype.process = function (deltaTime) {
	const phase = this.data.phases[this.data.phase];
	if (phase.process === undefined) { return; }

	phase.process(deltaTime);
};

Application.prototype.render = function () {
	const phase = this.data.phases[this.data.phase];
	if (phase.render === undefined) { return; }

	phase.render();
};

Application.prototype.connect = function (id, data) {
	const phase = this.data.phases[this.data.phase];
	if (phase.connect === undefined) { return; }

	phase.connect(id, data);
};

Application.prototype.disconnect = function (id, data) {
	const phase = this.data.phases[this.data.phase];
	if (phase.disconnect === undefined) { return; }

	phase.disconnect(id, data);
};

Application.prototype.reconnect = function (id, data) {
	const phase = this.data.phases[this.data.phase];
	if (phase.reconnect === undefined) { return; }

	phase.reconnect(id, data);
};

Application.prototype.receiveMessage = function (id, data) {
	const phase = this.data.phases[this.data.phase];
	if (phase.receiveMessage === undefined) { return; }

	phase.receiveMessage(id, data);
};
