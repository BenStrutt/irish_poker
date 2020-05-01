"use strict";

function Lobby(world) {
	// Get data at initialization;
	this.data = null;
	this.state = "namePrompt"
	this.button = new Button(
		world.Width * 0.9,
		world.Height * 0.05,
		80,
		40,
		"Start",
		function () { this.sendMessage({type: "start"}) },
	);
	this.prompt = new Prompt(
		"Your name: ",
		"set_name",
		world.Width * 0.5,
		world.Height * 0.5,
	);
}

Lobby.prototype.input = function (input) {
	switch (this.state) {
		case "namePrompt":
			this.prompt.input(input, this.data.connection);
			break;
		case "wait":
			this.button.input(input);
			break;
	}
};

Lobby.prototype.process = function (time) {
	switch (this.state) {
		case "namePrompt":
			this.prompt.process(time);
			break;
	}
};

Lobby.prototype.render = function () {
	switch (this.state) {
		case "namePrompt":
			this.prompt.render(this.data.context);
			this.renderPlayerList();
			break;
		case "wait":
			this.renderWaitScreen();
			this.renderPlayerList();
			if (this.data.connection.id === 0) {
				this.button.render(this.data.context);
			}
			break;
	}
};

Lobby.prototype.renderPlayerList = function () {
	let x = 8;
	let y = 20;
	const context = this.data.context;
	const players = this.data.players;

	context.font = "15px Helvetica";
	context.fillStyle = "#FFF";

	context.fillText("Players in lobby:", x, y);
	y += 20;
	for (const id in players) {
		const player = players[id];

		if (player.active === false || player.name === null) { continue; }

		context.fillText(player.name, x, y);
		y += 20;
	}
};

Lobby.prototype.renderWaitScreen = function () {
	const players = this.data.players;
	let allPlayersSet = true;
	for (const id in players) {
		if (players[id].name === null) { allPlayersSet = false; }
	}

	let text;
	if (!allPlayersSet) {
		text = "Waiting for players to enter names";
	} else {
		if (this.data.connection.id === 0) {
			text = "Press start to begin";
		} else {
			const name = (players[0].name) ? players[0].name : "player 1";
			text = `Waiting for ${name} to start game.`
		}
	}

	this.data.context.fillText(
		text,
		this.data.world.Width * 0.5,
		this.data.world.Height * 0.5,
	);
};

Lobby.prototype.wait = function (ipt, time) {

};

Lobby.prototype.connect = function (id, data) {
	if (id === this.data.connection.id) { this.initializeAppData(data); }

	this.data.players[id] = new Player();
};

Lobby.prototype.disconnect = function (id, data) {
	this.data.players[id].active = false;
}

Lobby.prototype.reconnect = function (id, data) {
	if (id === this.data.connection.id) { this.initializeAppData(data); }

	this.data.players[id].active = true;
}

Lobby.prototype.receiveMessage = function (id, data) {
	switch (data.type) {
		case "set_name":
			this.data.players[id].name = data.input;
			if (this.data.connection.id === id) { this.state = "wait"; }
			break;
			case "start":
				this.data.phase = "game";
				break;
	}
};

Lobby.prototype.initializeAppData = function (data) {
	this.data.phase = data.phase;
	this.data.round = data.round;
	this.data.turn = data.turn;
	this.data.totalPlayers = data.totalPlayers;
	this.data.players = {};
	for (const id in data.players) {
		const player = new Player();
		player.deserialize(data.players[id]);
		this.data.players[id] = player;
	}
};
