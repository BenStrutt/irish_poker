// Application.js
function Application(initialPhase) {
	this.phase = initialPhase;
	this.players = {};
}

Application.prototype.recieveMessage = function (id, data) {
	this[this.phase](id, data);
};

Application.prototype.changePhase = function (phase) {
	this.phase = phase;
	this[phase].initialize();
}
// End of Application.js

// Lobby.js
function Lobby(application) {
	this.application = application;
	this.state = "enter_name";
}

Lobby.prototype.changeState = function (state) {
	this.state = state;
	switch (state) {
		case "enter_name": { this.initializeEnterName(); break; }
		// potential client side
		case "waiting": {
			this.initializeWaiting(); // show start game button for you?
			break;
		}
	}
}

Lobby.prototype.recieveMessage = function (id, data) {
	switch (data.type) {
		case "set_name": {
			setName(id, data);
			break;
		}
		case "start_game": {
			startGame(id, data);
			break;
		}

};

Lobby.prototype.setName = function (id, data) {
	if (!validateSetName(id, data)) { return; }
	this.application.names[id] = data.name;
};

Lobby.prototype.validateSetName = function (id, data) {
	return this.application.names[id] !== undefined;
};

Lobby.prototype.startGame = function (id, data) {
	if (!validateStartGame(id, data)) { return; }
	this.application.state = "game";
};

Lobby.prototype.validateStartGame = function (id, data) {
	return id !== 0; // whoever's in control
}
// End of Lobby.js

// Game.js
function Game(application) {
	this.application = application;
	this.round = 0;
	this.turn = 0;
}

Game.prototype.recieveMessage = function (id, data) {
	switch (data.type) {
		case "guess": {
			this.guess(id, data);
			break;
		}
		case "give_drinks": {
			this.giveDrinks(id, data);
			break;
		}
};

// End of Game.js

// Main.js

const application = new Application("lobby");
application.lobby = new Lobby(application);
application.game = new Game(application);

connection.recieveMessage = application.recieveMessage;

// End of Main.js
