"use strict";

function Game() {
	this.state = null;
	this.buttons = {};
	this.roundButtons = {
		1: ["red", "black"],
		2: ["higher", "lower", "same"],
		3: ["inside", "outside", "same"],
		4: ["clubs", "diamonds", "hearts", "spades"],
	}
	this.drinkButton = new Button(
		function () { this.sendMessage({type: "take_drink"}) }.bind(this)
	);
	this.statusMessage = new Text();
}

Game.prototype.input = function (input) {
	this.drinkButton.input(input);

	switch (this.state) {
		case "choose":
			for (let i = 0; i < this.roundButtons[this.data.round].length; i++) {
				const type = this.roundButtons[this.data.round][i];
				this.buttons[type].input(input);
			}
			break;
		case "wait":
			break;
		case "reveal":
			break;
		case "give":
			for (const id in this.data.players) {
				const player = this.data.players[id];
				player.nameDisplay.input(input, this.context);
			}
			break;
	}
};

Game.prototype.process = function (time) {
	switch (this.state) {
		case "choose":
			break;
		case "wait":
			break;
		case "reveal":
			// in the following order:
			// animate card flip.
			// animate/show evaluation.
			// when done animating, run the following code:
			const player = this.data.players[this.data.turn];

			if (player.isCorrect(this.data.round)) {
				this.state = (this.data.turn === this.data.id) ? "give" : "receive";
				player.drinksToGive = this.data.round * 2;
			} else {
				player.receiveDrinks(this.data.round);
				this.data.turn++;
				if (this.data.turn >= this.data.totalPlayers) {
					this.data.turn = 0;
					this.data.round++;
					this.dealCards();
				}
				this.setState();
			}
			break;
		case "give":
			break;
	}
};

Game.prototype.render = function (renderer) {
	const currentPlayer = this.data.players[this.data.turn];

	this.renderTable(renderer);
	this.drinkButton.render(renderer);

	switch (this.state) {
		case "choose":
			for (let i = 0; i < this.roundButtons[this.data.round].length; i++) {
				const type = this.roundButtons[this.data.round][i];
				this.buttons[type].render(renderer);
			}
			break;
		case "wait":
			this.statusMessage.text = `${currentPlayer.name} is guessing.`;
			this.statusMessage.render(renderer);
			break;
		case "reveal":
			// const player = this.data.players[this.data.turn];
			// const text = `${player.name} guessed ${player.guesses[game.round - 1]}`
			// draw text to screen
			break;
		case "give":
			this.statusMessage.position(this.statusMessage.x, this.statusMessage.y - 10);
			this.statusMessage.text = `You have ${currentPlayer.drinksToGive} drinks to give.`;
			this.statusMessage.render(renderer);
			this.statusMessage.position(this.statusMessage.x, this.statusMessage.y + 20);
			this.statusMessage.text = `Click a player's name to give them a drink.`;
			this.statusMessage.render(renderer);
			this.statusMessage.position(this.statusMessage.x, this.statusMessage.y - 10);
			break;
		case "receive":
			this.statusMessage.text = `${currentPlayer.name} is giving drinks`;
			this.statusMessage.render(renderer);
			break;
	}
};

Game.prototype.receiveMessage = function (data) {
	const localData = this.data;

	switch (data.type) {
		case "initialize":
			this.initialize(data);
			break;
		case "guess":
			const player = localData.players[data.id]
			const cardIdx = localData.round - 1;
			const card = player.cards[cardIdx];

			card.deserialize(data.card);

			player.guesses.push(data.guess);
			this.state = "reveal";
			break;
		case "receive_drink":
			localData.players[localData.turn].drinksToGive--;
			localData.players[data.id].totalDrinks++;
			localData.players[data.id].outstandingDrinks++;

			if (localData.players[localData.turn].drinksToGive === 0) {
				localData.turn++;
				if (localData.turn >= localData.totalPlayers) {
					localData.turn = 0;
					localData.round++;
					this.dealCards();
				}
				this.setState();
			}
			break;
		case "took_drink":
			localData.players[data.id].outstandingDrinks--;
			break;
	}
};

Game.prototype.initialize = function (data) {
	this.setCards(data);
	this.setSeats();
	this.setState();
	this.setButtons();

	const statusMessage = this.statusMessage;
	const width = this.data.world.Width;
	const height = this.data.world.Height;
	statusMessage.position(width * 0.5, height * 0.5);
	statusMessage.style(15, "Helvetica", "#FFF");

	for (const id in this.data.players) {
		const player = this.data.players[id];
		player.nameDisplay.onPress = function () {
			this.sendMessage({type: "give_drink", id: id});
		}.bind(this);
	}
};

Game.prototype.setCards = function (data) {
	for (const id in this.data.players) {
		this.data.players[id].deserialize(data.players[id]);
	}
};

Game.prototype.setSeats = function () {
	const players = this.data.players;
	const world = this.data.world;
	const local = this.data.id;
	const seats = this.data.totalPlayers;

	for (const id in players) {
		const player = players[id];
		const position = getSeatPosition((local + Number(id)) % seats, seats);
		player.x = position.x * world.Width;
		player.y = position.y * world.Height;
	}
};

Game.prototype.setState = function () {
	this.state = (this.data.turn === this.data.id) ? "choose" : "wait";
};

Game.prototype.setButtons = function () {
	const localData = this.data;

	const world = localData.world;
	const width = world.Width;
	const height = world.Height;

	const buttons = this.buttons;

	this.drinkButton.resize(80, 40);
	this.drinkButton.setText("Take Drink");
	this.drinkButton.position(width * 0.9, height * 0.05);

	const buttonTypes = [
		"red", "black", "higher", "lower", "same", "inside", "outside", "clubs",
		"diamonds", "hearts", "spades",
	]
	for (let i = 0; i < buttonTypes.length; i++) {
		const type = buttonTypes[i];
		buttons[type] = new Button(
			function () { this.sendMessage({type: "guess", guess: type}) }.bind(this)
		)
		buttons[type].resize(80, 40);
		buttons[type].setText(type.charAt(0).toUpperCase() + type.slice(1));
	}

	buttons.red.position(width * 0.4, height * 0.5);
	buttons.black.position(width * 0.6, height * 0.5);
	buttons.higher.position(width * 0.3, height * 0.5);
	buttons.lower.position(width * 0.7, height * 0.5);
	buttons.same.position(width * 0.5, height * 0.5);
	buttons.inside.position(width * 0.3, height * 0.5);
	buttons.outside.position(width * 0.7, height * 0.5);
	buttons.clubs.position(width * 0.2, height * 0.5);
	buttons.diamonds.position(width * 0.4, height * 0.5);
	buttons.hearts.position(width * 0.6, height * 0.5);
	buttons.spades.position(width * 0.8, height * 0.5);
};


Game.prototype.renderTable = function (renderer) {
	const players = this.data.players;
	for (const id in players) {
		const player = players[id];
		player.render(renderer);
	}
};

Game.prototype.dealCards = function () {
	const players = this.data.players;
	for (const id in players) {
		const player = players[id];
		player.cards.push(new Card());
	}
};
