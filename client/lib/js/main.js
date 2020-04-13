"use strict";

const assets = new Assets();
// assets.load(ASSET_DATA, render);

function renderCards() {
	const players = game.players;

	for (const id in players) {
		if (players[id].active === false || players[id].cards.length === 0) { continue; }

		for (let i = 0; i < players[id].cards.length; i++) {
			players[id].cards[i].render(context);
		}
	}

	//
	// const cardClubs2 = new Card();
	// cardClubs2.deserialize({suit: "hearts", value: 13});
	// const cardUnknown = new Card();
	//
	// cardUnknown.x = 300;
	//
	// cardClubs2.render(context);
	// cardUnknown.render(context);
}

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.disconnect = disconnect;
connection.reconnect = connect;
connection.receiveMessage = receiveMessage;

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

const Board = {
	Width: 1200,
	Height: 600,
}

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = Board.Width;
canvas.height = Board.Height;
canvas.style.backgroundColor = "#277a2b";

document.body.appendChild(canvas);

let input;

document.addEventListener("keydown", (e) => {
	input = e;
});

document.addEventListener("click", handleClick);

function handleClick(e) {
	const x = e.offsetX;
	const y = e.offsetY;

	if (connection.id === 0 && game.state === "lobby") {
		if ((x > 805 && x < 842) && (y > 4 && y < 22)) {
			connection.sendMessage({type: "round1"});
		}
	}
}

const game = {
	state: null,
	players: {},
};

function renderTable() {
	context.font = "15px Helvetica";

	for (const id in game.players) {
		const player = game.players[id];

		if (player.active === false) { continue; }

		context.fillStyle = (id === game.turn) ? "#FF0" : "#FFF";
		context.fillText(player.name, player.positionX, player.positionY);

		assets.load(ASSET_DATA, renderCards);
	}
}

const process = {
	time: 0,
	loop: function (time = 0) {
		requestAnimationFrame(this.loop.bind(this));

		const deltaTime = time - this.time;
		this.time = time;

		if (game.state === "lobby") {
			name.update(deltaTime, input);
			context.clearRect(0, 0, Board.Width, Board.Height);
			name.render(context);
			this.renderPlayerList();
		};

		if (game.state === "round1") {
			if (game.turn === connection.id) {
				guess.update(deltaTime, input);
				context.clearRect(0, 0, Board.Width, Board.Height);
				guess.render(context);
			}
		}
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

const name = new Prompt("Your Name");
name.x = Board.Width * 0.5;
name.y = Board.Height * 0.5;

const guess = new Prompt("Guess");
guess.x = Board.Width * 0.5;
guess.y = Board.Width * 0.5;

process.loop();
