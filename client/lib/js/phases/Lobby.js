"use strict";

function Lobby(world) {
	this.state = "namePrompt";
	this.button = new Button(this.startGame.bind(this));
	this.prompt = new Prompt(this.setName.bind(this));
	this.lobbyPlayers = new Text();
	this.statusMessage = new Text();
	this.playerName = new Text();
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
			this.prompt.input(input);
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

Lobby.prototype.render = function (renderer) {
	switch (this.state) {
		case "namePrompt":
			this.renderNamePromtScreen(renderer);
			break;
		case "wait":
			this.renderWaitScreen(renderer);
			break;
	}
};

Lobby.prototype.renderNamePromtScreen = function (renderer) {
	this.renderPlayerList(renderer);
	this.prompt.render(renderer);
};

Lobby.prototype.renderWaitScreen = function (renderer) {
	this.renderPlayerList(renderer);

	const players = this.data.players;
	let allPlayersSet = true;
	for (const id in players) {
		if (players[id].name === null) { allPlayersSet = false; }
	}

	if (!this.canStartGame()) {
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
		this.statusMessage.text = text;
		this.statusMessage.render(renderer);
		return;
	}

	this.button.render(renderer);
};

Lobby.prototype.renderPlayerList = function (renderer) {
	const players = this.data.players;

	this.lobbyPlayers.render(renderer);

	const playerName = this.playerName;
	playerName.y = this.lobbyPlayers.y + 45;
	for (const id in players) {
		const player = players[id];

		if (player.active === false) { continue; }

		playerName.text = (player.name === null) ? "..." : player.name;
		playerName.render(renderer);
		playerName.y += 45;
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
	// This is running twice on reconnect

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
	button.key = "button_start_game";
	button.resize(201, 101);
	button.position(width * 0.5, height * 0.5);

	const prompt = this.prompt;
	prompt.label = "Your name:";
	prompt.position(width * 0.5, height * 0.5);

	const lobbyPlayers = this.lobbyPlayers;
	lobbyPlayers.position(width * 0.10, height * 0.035);
	lobbyPlayers.style(50, "Roboto, sans-serif", "#FFF");
	lobbyPlayers.text = "Players in lobby:";

	const statusMessage = this.statusMessage;
	statusMessage.position(width * 0.5, height * 0.5);
	statusMessage.style(40, "Roboto, sans-serif", "#FFF");

	const playerName = this.playerName;
	playerName.position(lobbyPlayers.x, lobbyPlayers.y + 45);
	playerName.style(40, "Roboto, sans-serif", "#FFF");
};

Lobby.prototype.canStartGame = function () {
	const localData = this.data;
	const players = localData.players;
	for (const id in players) {
		if (players[id].name === null) { return false; }
	}

	return localData.id === 0;
};
