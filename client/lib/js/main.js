"use strict";

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.disconnect = disconnect;
connection.reconnect = connect;
connection.receiveMessage = receiveMessage;

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const Board = {
	Width: 1200,
	Height: 600,
}

canvas.width = Board.Width;
canvas.height = Board.Height;
canvas.style.backgroundColor = "#277a2b";

document.body.appendChild(canvas);

const game = {
	state: null,
	players: {},
};

const assets = new Assets();
assets.load(ASSET_DATA, gameStart);

const name = new Prompt("Your Name");
name.x = Board.Width * 0.5;
name.y = Board.Height * 0.5;

// {type: keydown, keyCode, key}
// {type: mousedown, x, y}
const INPUT = [];

document.addEventListener("keydown", (e) => {
	INPUT.push({type: "keydown", keyCode: e.keyCode, key: e.key});
});

document.addEventListener("mousedown", (e) => {
	INPUT.push({type: "mousedown", x: e.offsetX, y: e.offsetY});
});

function gameStart() {
	process.loop();
}

function connect(id, data) {
	const players = game.players;
	if (id === connection.id) {
		for (const id in data.players) {
			const player = new Player();
			player.deserialize(data.players[id]);
			players[id] = player;
		}

		game.state = data.state;

		return;
	}

	if (players[id] !== undefined) {
		players[id].active = true;
		return;
	}

	const player = new Player();
	player.deserialize(data.players[id]);
	players[id] = player;
}

function disconnect(id, data) {
	for (const id in data.players) {
		const player = new Player();
		player.deserialize(data.players[id]);
		game.players[id] = player;
	}
}

function receiveMessage(id, data) {
	switch (data.type) {
		case "set_name": {
			game.players[id].name = data.name;
			console.log("Welcome " + game.players[id].name + "!");
			break;
		}
		case "round1": {
			game.state = "round1";
			game.turn = 0;
			for (const id in data.players) {
				const player = new Player();
				player.deserialize(data.players[id]);

				for (let i = 0; i < player.cards.length; i++) {
					const card = new Card();
					card.deserialize(player.cards[i]);
					player.cards[i] = card;
				}

				game.players[id] = player;
			}
			context.clearRect(0, 0, Board.Width, Board.Height)
			renderTable();
			break;
		}
	}
}

const process = {
	time: 0,

	loop: function (time = 0) {
		requestAnimationFrame(this.loop.bind(this));

		const deltaTime = time - this.time;
		this.time = time;

		// this.states[game.state]()

		if (game.state === "lobby") {
			name.input(INPUT);
			name.update(deltaTime);
			context.clearRect(0, 0, Board.Width, Board.Height);
			name.render(context);
			this.renderPlayerList();
		};

		INPUT.length = 0;
	},

	renderPlayerList: function () {
		let x = 8;
		let y = 20;

		context.font = "15px Helvetica";
		context.fillStyle = "#FFF";

		if (connection.id === 0) {
			context.fillText("Start", x + 800, y);
		}

		context.fillText("Players in lobby:", x, y);
		y += 20;
		for (const id in game.players) {
			const player = game.players[id];

			if (player.active === false || player.name === null) { continue; }

			context.fillText(player.name, x, y);
			y += 20;
		}
	},
};
