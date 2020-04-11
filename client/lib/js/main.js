"use strict";

const assets = new Assets();
assets.load(ASSET_DATA, render);

function render() {
	const cardClubs2 = new Card();
	cardClubs2.deserialize({suit: "hearts", value: 13});
	const cardUnknown = new Card();

	cardUnknown.x = 300;

	cardClubs2.render(context);
	cardUnknown.render(context);
}

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.reconnect = connect;
connection.receiveMessage = receiveMessage;

function connect(id, data) {
	const players = game.players;
	if (id === connection.id) {
		for (const key in data.players) {
			const player = new Player();
			player.deserialize(data.players[key]);
			players[key] = player;
		}
		return;
	}

	if(players[id] !== undefined) { return; }

	const player = new Player();
	player.deserialize(data.players[id]);
	players[id] = player;

}

function receiveMessage(id, data) {
	switch (data.type) {
		case "set_name": {
			game.players[id].name = data.name;
			console.log("Welcome " + game.players[id].name + "!");
			break;
		}
	}
}

const Board = {
	Width: 1000,
	Height: 600,
}

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = Board.Width;
canvas.height = Board.Height;
canvas.style.backgroundColor = "#277a2b";

document.body.appendChild(canvas);

document.addEventListener("keydown", (e) => {
	const code = e.keyCode;
	if (code === 8) {
		if (name.current.length) {
			name.current = name.current.slice(0, -1);
		}
	} else if (code === 32 || code >= 65 && code <= 90) {
		if (name.current.length < 40) { name.current += e.key; };
	} else if (code === 13) {
		connection.sendMessage({
			type: "set_name",
			name: name.current,
		});
		name.current = "";
	}
});

const game = {
	state: "loby",
	players: {},
};

function processInput() {
	player.name = name.current;
	player.state = "lobby";
}

const process = {
	time: 0,
	loop: function (time = 0) {
		requestAnimationFrame(this.loop.bind(this));

		const deltaTime = time - this.time;
		this.time = time;

		if (player.state === "title") {
			name.update(deltaTime);
			name.render(context);
		};

	},
};

const name = new Prompt("Name");
name.x = Board.Width * 0.5;
name.y = Board.Height * 0.5;

const player = new Player();
player.state = "title";

process.loop();
