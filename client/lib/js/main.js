"use strict";

const connection = new Connection("localhost", 8080);

connection.receiveMessage = receiveMessage;

function receiveMessage(id, data) {
	if (data.type === "draw_card") {
		drawCard(id, data.card);
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
				processInput();
		}
});

const game = {
	round1: function () {
		const penalty = 2;

		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			const cards = player.cards;
			const guess = player.guessColor();
			const card = deck.drawCard();
			const evaluation = function (player) {
				return guess === card.color;
			}

			cards.push(card);
			this.outcome(penalty, evaluation, player);
		}
	},

	round2: function () {
		const penalty = 4;

		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			const cards = player.cards;
			const guess = player.guessHighLow();
			const card = deck.drawCard();
			const evaluation = function (player) {
				return guess === player.evalHighLow();
			}

			cards.push(card);
			this.outcome(penalty, evaluation, player);
		}
	},

	round3: function () {
		const penalty = 6;

		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			const cards = player.cards;
			const guess = player.guessInsideOutside();
			const card = deck.drawCard();
			const evaluation = function (player) {
				return guess === player.evalInsideOutside();
			}

			cards.push(card);
			this.outcome(penalty, evaluation, player);
		}
	},

	round4: function () {
		const penalty = 8;

		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			const cards = player.cards;
			const guess = player.guessSuit();
			const card = deck.drawCard();
			const evaluation = function (player) {
				return guess === card.suit;
			}

			cards.push(card);
			this.outcome(penalty, evaluation, player);
		}
	},

	outcome: function (penalty, evaluation, player) {
		evaluation(player) ? player.gives(penalty) : player.takes(penalty);
	}
};

function processInput() {
	player.name = name.current;
	player.state = "lobby";
}

const process = {
	states: {},
	time: 0,
	loop: function (time = 0) {
		requestAnimationFrame(this.loop.bind(this));

		const deltaTime = time - this.time;
		this.time = time;

		const state = this.states[player.state];
		state.input(input);
		state.update(deltaTime);
		state.render(deltaTime);

	},
};

process.states.title = new Title();

function Title (x, y) {
	const name = this.name = new Prompt();
	name.x = x;
	name.y = y;
};

Title.prototype.input = function (input) {
	this.name.control(input);
};

Title.prototype.update = function (deltaTime) {
	this.name.update(deltaTime);
};

Title.prototype.render = function (renderer) {
	this.name.render(renderer);
};

const name = new Prompt("Name");
name.x = Board.Width * 0.5;
name.y = Board.Height * 0.5;

const player = new Player();
player.state = "title";

process.loop();
