"use strict";

const connection = new Connection("localhost", 8080);

connection.connect = connect;
connection.disconnect = disconnect;
connection.reconnect = connect;
connection.receiveMessage = receiveMessage;

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const Board = {
	Width: 640,
	Height: 480,
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

// const INPUT = {
// 	keys: [],
// 	mouse: {
// 		down: false,
// 		position: { x: 0, y: 0 }
// 	},
// };
//
// document.addEventListener("keydown", (e) => {
// 	INPUT.keys.push({keyCode: e.keyCode, key: e.key});
// });
//
// document.addEventListener("mousedown", (e) => {
// 	const mouse = INPUT.mouse;
// 	mouse.down = true;
// 	mouse.position.x = e.offsetX;
// 	mouse.position.y = e.offsetY;
// });
//
// document.addEventListener("mousemove", (e) => {
// 	const mouse = INPUT.mouse;
// 	mouse.position.x = e.offsetX;
// 	mouse.position.y = e.offsetY;
// });
//
// document.addEventListener("mouseup", (e) => {
// 	const mouse = INPUT.mouse;
// 	mouse.down = false;
// 	mouse.position.x = e.offsetX;
// 	mouse.position.y = e.offsetY;
// });

document.addEventListener("keydown", (e) => {
	INPUT.push({type: "keydown", keyCode: e.keyCode, key: e.key});
});

document.addEventListener("mousedown", (e) => {
	INPUT.push({type: "mousedown", x: e.offsetX, y: e.offsetY});
});

document.addEventListener("mousemove", (e) => {
	INPUT.push({type: "mousemove", x: e.offsetX, y: e.offsetY});
});

document.addEventListener("mouseup", (e) => {
	INPUT.push({type: "mouseup", x: e.offsetX, y: e.offsetY});
});

function startGame() {
	process.loop();
}

function connect(id, data) {
	if (id === connection.id) {
		game.round = data.round;
		game.turn = data.turn;
	}

	deserializePlayerData(data.players);
	game.players[id].active = true;
}

function disconnect(id, data) {
	game.players[id].active = false;
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
	const seats = 2;
	const local = connection.id;
	for (const id in players) {
		let player = game.players[id];
		if (player === undefined) {
			const position = getSeatPosition((local + Number(id)) % seats, seats);
			player = new Player(
				position.x * Board.Width,
				position.y * Board.Height,
			);
			game.players[id] = player;
		}
		player.deserialize(players[id]);
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

const button = new Button(
	Board.Width * 0.5,
	Board.Height * 0.5,
	100,
	50,
	function () { console.log("PRESSED!"); },
);
button.text = "BUTTON";

function lobby(ipt, time) {
	button.input(ipt);
	name.input(ipt);
	name.update(time);

	context.clearRect(0, 0, Board.Width, Board.Height);

	name.render(context);
	renderPlayerList();
	button.render(context);
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

	const players = game.players;
	for (const key in players) {
		const player = players[key];
		player.render(context);
	}

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

	const players = game.players;
	for (const key in players) {
		const player = players[key];
		player.render(context);
	}

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

	const players = game.players;
	for (const key in players) {
		const player = players[key];
		player.render(context);
	}

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

	const players = game.players;
	for (const key in players) {
		const player = players[key];
		player.render(context);
	}

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
