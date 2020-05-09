"use strict";

const World = {
	Width: 640,
	Height: 480,
};

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = World.Width;
canvas.height = World.Height;

canvas.style.backgroundColor = "#277a2b";

document.body.appendChild(canvas);

const assets = new Assets();
assets.load(ASSET_DATA, startGame);

const application = new Application("lobby");
application.setConnection(new Connection("localhost", 8080));
application.setAssets(assets);
application.setWorld(World);

application.setPhase("lobby", new Lobby());
application.setPhase("game", new Game());
application.setPhase("game_over", new GameOver());

application.phases.lobby.context = context;
application.phases.game.context = context;
application.phases.game_over.context = context;

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

		context.clearRect(0, 0, World.Width, World.Height);
		application.render(context);

		INPUT.length = 0;
	},
};
