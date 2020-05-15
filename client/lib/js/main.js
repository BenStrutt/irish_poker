"use strict";

const WIDTH = 1920;
const HEIGHT = 1075;

const World = {
	Width: WIDTH,
	Height: HEIGHT,
};

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

canvas.style.backgroundColor = "#000";

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

window.onload = resize;
window.onresize = resize;

function resize() {
	const width = document.body.clientWidth;
	const scale = width / WIDTH;
	const height = HEIGHT * scale;

	canvas.width = width;
	canvas.height = height;

	context.scale(scale, scale);
}

const flags = {
	loaded: false,
	touched: false,
	music: false,
};

const INPUT = [];
document.addEventListener("keydown", (e) => {
	flags.touched = true;
	INPUT.push({type: "keydown", keyCode: e.keyCode, key: e.key});
});

document.addEventListener("mousedown", (e) => {
	flags.touched = true;
	INPUT.push({type: "mousedown", x: e.offsetX, y: e.offsetY});
});

document.addEventListener("mousemove", (e) => {
	INPUT.push({type: "mousemove", x: e.offsetX, y: e.offsetY});
});

document.addEventListener("mouseup", (e) => {
	INPUT.push({type: "mouseup", x: e.offsetX, y: e.offsetY});
});


function startMusic() {
	if (!flags.touched) { return; }
	if (flags.music) { return; }
	flags.music = true;
	const bgmusic = assets.getSound("song");
	bgmusic.loop = true;
	bgmusic.volume = 0.01;
	bgmusic.play();
}

function startGame() {
	flags.loaded = true;
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

		tween.update(deltaTime);

		context.drawImage(assets.getImage("table"), 0, 0, World.Width, World.Height);
		application.render(context);

		INPUT.length = 0;
	},
};
