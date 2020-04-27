"use strict";

const application = new Application();

application.width = 640;
application.height = 480;

application.canvas = document.createElement("canvas");
application.context = application.canvas.getContext("2d");

application.connection = new Connection("localhost", 8080);
application.connection.connect = application.connect;
application.connection.disconnect = application.disconnect;
application.connection.reconnect = application.connect;
application.connection.receiveMessage = application.receiveMessage;

const INPUT = [];
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

application.assets = new Assets();
application.assets.load(ASSET_DATA, startGame);

function startGame() {
	loop.run();
}

const loop = {
	time: 0,
	run: function (time = 0) {
		requestAnimationFrame(this.run.bind(this));

		const deltaTime = time - this.time;
		this.time = time;

		const phase = application.phases[application.phase];
		phase.states[phase.state](INPUT, deltaTime);
	},
};
