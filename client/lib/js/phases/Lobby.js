"use strict";

function Lobby(world) {
	// Get data at initialization;
	this.data = null;
	this.state = "namePrompt";
	this.button = new Button(this.startGame.bind(this));
	this.prompt = new Prompt(this.setName.bind(this));

}

Lobby.prototype.startGame = function () {
	this.sendMessage({type: "start"});
};

Lobby.prototype.setName = function (name) {
	this.sendMessage({type: "set_name", input: name});
};

Lobby.prototype.input = function (input) {
	switch (this.state) {
		case "namePrompt":
			this.prompt.input(input, this.data.connection);
			break;
		case "wait":
			if (!this.canStartGame()) { break; }
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

Lobby.prototype.render = function (context) {
	switch (this.state) {
		case "namePrompt":
			this.renderNamePromtScreen(context);
			break;
		case "wait":
			this.renderWaitScreen(context);
			break;
	}
};

Lobby.prototype.renderNamePromtScreen = function (context) {
	this.renderPlayerList(context);
	this.prompt.render(context);
};

Lobby.prototype.renderWaitScreen = function (context) {
	this.renderPlayerList(context);

	const players = this.data.players;
	let allPlayersSet = true;
	for (const id in players) {
		if (players[id].name === null) { allPlayersSet = false; }
	}

	let text;
	if (!allPlayersSet) {
		text = "Waiting for players to enter names";
	} else {
		if (this.canStartGame()) {
			text = "Press start to begin";
		} else {
			const name = (players[0].name) ? players[0].name : "player 1";
			text = `Waiting for ${name} to start game.`
		}
	}

	context.fillText(
		text,
		this.data.world.Width * 0.5,
		this.data.world.Height * 0.5,
	);

	if (!this.canStartGame()) { return; }

	this.button.render(context);
};

Lobby.prototype.renderPlayerList = function (context) {
	let x = 8;
	let y = 20;

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

Lobby.prototype.receiveMessage = function (data) {
	switch (data.type) {
		case "initialize":
			this.initialize(data);
			break;
		case "set_name":
			const id = data.id;
			this.data.players[id].name = data.input;
			if (this.data.id === id) { this.state = "wait"; }
			break;
	}
};

Lobby.prototype.initialize = function (data) {
	const localData = this.data;

	if (localData.players !== undefined) {
		const localID = localData.id;
		const isNameNull = localData.players[localID].name === null;
		this.state = isNameNull ? "namePrompt" : "wait";
	}

	const world = localData.world;
	const width = world.Width;
	const height = world.Height;

	const button = this.button;
	button.position(width * 0.9, height * 0.05);
	button.resize(80, 40);
	button.setText("Start");

	const prompt = this.prompt;
	prompt.label = "Your name:";
	prompt.position(width * 0.5, height * 0.5);
};

Lobby.prototype.canStartGame = function () {
	const localData = this.data;
	const players = localData.players;
	for (const id in players) {
		if (players[id].name === null) { return false; }
	}

	return localData.id === 0;
};
