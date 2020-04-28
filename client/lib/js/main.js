"use strict";

// make canvas stuff
// application.canvas = document.createElement("canvas");
// application.context = application.canvas.getContext("2d");

const assets = new Assets();
assets.load(ASSET_DATA, startGame);

const application = new Application();
application.setAssets(assets);

application.setConnection(new Connection("localhost", 8080));

application.setBoard(Board);

application.setPhase("lobby", new Lobby());
application.setPhase("game", new Game());
application.setPhase("game_over", new GameOver());

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


function startGame() {
	loop.run();
}

const loop = {
	time: 0,
	run: function (time = 0) {
		requestAnimationFrame(this.run.bind(this));

		const deltaTime = time - this.time;
		this.time = time;

		application.input(INPUT);
		application.process(deltaTime);

		context.clearRect(0, 0, Board.Width, Board.Height);
		application.render(context);

	},
};
