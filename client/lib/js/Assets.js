"use strict";

function Assets() {
	this.imageCache = {};
	this.soundCache = {};
}

Assets.prototype.load = function (sources, callback) {
	const imagePath = "assets/images/";
	const soundPath = "assets/sounds/";

	const imageCache = this.imageCache;
	const soundCache = this.soundCache;

	let loading = 0;
	let loaded = 0;

	for (const key in sources) {
		const fileName = sources[key];
		const extension = fileName.split(".")[1];

		++loading;

		if (extension === "png") {
			const image = new Image();
			image.src = imagePath + fileName;
			imageCache[key] = image;
			image.onload = function() {
				if (++loaded < loading) { return; }
				callback();
			};
		} else {
			const sound = new Audio();
			sound.src = soundPath + fileName;
			soundCache[key] = sound;
			sound.oncanplaythrough = function() {
				if (++loaded < loading) { return; }
				callback();
			};
		}

	}

};

Assets.prototype.getImage = function (key) {
	return this.imageCache[key];
};

Assets.prototype.getSound = function (key) {
	return this.soundCache[key];
};
