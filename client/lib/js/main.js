"use strict";

const connection = new Connection("localhost", 8080);

const Board = {
	Width: 1000,
	Height: 600,
}

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = Board.Width;
canvas.height = Board.Height;
canvas.style = "border:5px solid #3d2000;"
canvas.style.backgroundColor = "#277a2b";

document.body.appendChild(canvas);

document.addEventListener("keydown", handleKeyDown);

let keyDown;

function handleKeyDown(data) {
	data.preventDefault();

	keyDown = data.code;
}

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

const players = [new Player("Chris"), new Player("Ben")];
const deck = new Deck();
