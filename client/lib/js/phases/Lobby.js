"use strict";

function Lobby(app) {
	this.app = app;
	this.state = "namePrompt"
	this.states = {
		namePrompt: this.namePrompt,
		wait: this.wait,
	}
	this.prompt = new Prompt(
		"Your name: ",
		"set_name",
		app.width * 0.5,
		app.height * 0.5,
	);
}

Lobby.prototype.namePrompt = function (ipt, time) {
	console.log(this)

	this.prompt.input(ipt);
	this.prompt.update(time);

	context.clearRect(0, 0, Board.Width, Board.Height);

	this.prompt.render(context);
	this.renderPlayerList();
};

Lobby.prototype.renderPlayerList = function () {
	let x = 8;
	let y = 20;

	context.font = "15px Helvetica";
	context.fillStyle = "#FFF";

	context.fillText("Players in lobby:", x, y);
	y += 20;
	for (const id in game.players) {
		const player = game.players[id];

		if (player.active === false || player.name === null) { continue; }

		context.fillText(player.name, x, y);
		y += 20;
	}
};

Lobby.prototype.wait = function (ipt, time) {

};

Lobby.prototype.receiveMessage = function (id, data) {
	switch (data.type) {
		case "set_name":
			app.players[id].name = data.input;
			break;
		case "start":
			app.phase = "game";
			app.drawCards();
			break;
	}
};
