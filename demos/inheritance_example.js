// Quick inheritance example
// syntactic sugar
class Game extends Phase {
	constructor() {
		this.name = "ben";
	}
	someMethod() {
		// do stuff
	}
}

// what's actually happening
function Game() {
	Phase.call(this);

	this.name = "ben";
}
Game.prototype = new Phase();
Game.prototype.someMethod = function () { /* do stuff */ };
