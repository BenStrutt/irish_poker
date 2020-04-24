"use strict";

const tween = {
	types: {
		CALL: 0,
		TO: 1,
		WAIT: 2,
	},
	queue: [],
	create: function (target) {
		const twn = new Tween(target);
		this.queue.push(twn);
		return twn;
	},
	update: function (deltaTime) {
		const tweens = this.queue;

		for (let i = tweens.length - 1; i >= 0; i--) {
			const tween = tweens[i];
			const target = tween.target;
			const queue = tween.queue
			const action = queue[0];

			let remove = false;
			const types = this.types;
			switch (action.type) {
				case types.CALL: {
					action.callback();
					remove = true;
					break;
				}
				case types.TO: {
					const portion = Math.min(1, (action.time += deltaTime) / action.duration);
					const keys = action.keys;

					let from = action.from;
					if (from === null) {
						action.from = from = {};
						for (const key in keys) {
							from[key] = target[key];
						}
					}

					for (const key in keys) {
						target[key] = from[key] + (keys[key] - from[key]) * portion;
					}

					remove = portion === 1;
					break;
				}
				case types.WAIT: {
					remove = (action.time += deltaTime) >= action.duration;
					break;
				}
			}

			if (!remove) { continue; }

			queue.shift();
			if (queue.length > 0) { continue; }

			tweens.splice(i, 1);
		}
	}
};

function Tween(target) {
	this.target = target;
	this.queue = [];
}

Tween.prototype.to = function (keys, duration) {
	const target = this.target;

	this.queue.push({
		type: tween.types.TO,
		from: null,
		keys: keys,
		duration: duration,
		time: 0,
	});

	return this;
};

Tween.prototype.call = function (callback) {
	this.queue.push({
		type: tween.types.CALL,
		callback: callback,
	});

	return this;
};

Tween.prototype.wait = function (duration) {
	this.queue.push({
		type: tween.types.WAIT,
		time: 0,
		duration: duration,
	});

	return this;
};
