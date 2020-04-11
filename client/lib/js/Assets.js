"use strict";

function Assets() {
	this.folder = "assets/images/";
	this.cache = {};
}

Assets.prototype.load = function (sources, callback) {
	const folder = this.folder;
	const cache = this.cache;
	let loading = 0;
	let loaded = 0;

	for (const key in sources) {
		const image = new Image();
		image.src = folder + sources[key];

		++loading;
		image.onload = function() {
			if (++loaded < loading) { return; }
			callback();
		};

		cache[key] = image;
	}
};

Assets.prototype.get = function (key) {
	return this.cache[key];
};
