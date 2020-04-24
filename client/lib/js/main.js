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
	round: 0,
	players: {},
};

const assets = new Assets();
assets.load(ASSET_DATA, startGame);

const name = new Prompt("name");
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

function startGame() {
	process.loop();
}

function connect(id, data) {
	const players = game.players;

	if (id === connection.id) {
		for (const id in data.players) {
			const player = new Player();
			player.deserialize(data.players[id]);
			game.players[id] = player;
		}

		game.round = data.round;
		game.turn = data.turn;

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
	deserializePlayerData(data.players);
}

function receiveMessage(id, data) {
	switch (data.type) {
		case "name": {
			game.players[id].name = data.input;
			console.log("Welcome " + game.players[id].name + "!");
			break;
		}
		case "start": {
			game.round = 1;
			game.turn = 0;
			deserializePlayerData(data.players);
			context.clearRect(0, 0, Board.Width, Board.Height)
			break;
		}
		case "correct": {
			console.log("correct!");

			if (id === connection.id) { game.players[id].gives(game.round * 2); }

			game.turn = data.turn;
			game.round = data.round;
			deserializePlayerData(data.players);
			break;
		}
		case "incorrect": {
			console.log("incorrect :(");

			if (id === connection.id) { game.players[id].takes(game.round * 2); }

			game.turn = data.turn;
			game.round = data.round;
			break;
		}
		case "takes": {
			console.log(`${game.players[id].name} takes ${data.penalty} drinks.`)
			game.turn = data.turn;
			game.round = data.round;
			deserializePlayerData(data.players);
			break;
		}
		case "gives": {
			console.log(`${game.players[id].name} gives ${game.players[data.taker].name} ${data.penalty} drinks.`)
			game.turn = data.turn;
			game.round = data.round;
			deserializePlayerData(data.players);
			break;
		}
	}
}

function deserializePlayerData(players) {
	for (const id in players) {
		const player = new Player();
		player.deserialize(players[id]);
		game.players[id] = player;
	}
}

const process = {
	time: 0,
	round: {
		0: lobby,
		1: roundOne,
		2: roundTwo,
		3: roundThree,
		4: roundFour,
	},

	loop: function (time = 0) {
		requestAnimationFrame(this.loop.bind(this));

		const deltaTime = time - this.time;
		this.time = time;

		this.round[game.round](INPUT, deltaTime)

		INPUT.length = 0;
	},
};

function lobby(ipt, time) {
	name.input(ipt);
	name.update(time);
	context.clearRect(0, 0, Board.Width, Board.Height);
	name.render(context);
	renderPlayerList();
}

function renderPlayerList() {
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
}

function roundOne(ipt, time) {
	context.clearRect(0, 0, Board.Width, Board.Height);

	context.font = "15px Helvetica";
	context.fillStyle = "FFF";

	if (game.turn === connection.id) {
		context.fillText(
			"Your turn. Guess either Red or Black.",
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	} else {
		context.fillText(
			`${game.players[game.turn].name} is guessing.`,
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	}
}

function roundTwo(ipt, time) {
	context.clearRect(0, 0, Board.Width, Board.Height);

	context.font = "15px Helvetica";
	context.fillStyle = "FFF";

	if (game.turn === connection.id) {
		context.fillText(
			"Your turn. Guess Inside, Outside, or Same.",
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	} else {
		context.fillText(
			`${game.players[game.turn].name} is guessing.`,
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	}
}

function roundThree(ipt, time) {
	context.clearRect(0, 0, Board.Width, Board.Height);

	context.font = "15px Helvetica";
	context.fillStyle = "FFF";

	if (game.turn === connection.id) {
		context.fillText(
			"Your turn. Guess Higher, Lower, or Same.",
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	} else {
		context.fillText(
			`${game.players[game.turn].name} is guessing.`,
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	}
}

function roundFour(ipt, time) {
	context.clearRect(0, 0, Board.Width, Board.Height);

	context.font = "15px Helvetica";
	context.fillStyle = "FFF";

	if (game.turn === connection.id) {
		context.fillText(
			"Your turn. Guess the suit.",
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	} else {
		context.fillText(
			`${game.players[game.turn].name} is guessing.`,
			Board.Width * 0.5,
			Board.Height * 0.5,
		);
	}
}
