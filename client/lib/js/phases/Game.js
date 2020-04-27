"use strict";

function Game(app) {
	this.app = app;
	this.state = "deal";
	this.states = {
		wait: this.wait,
		choose: this.choose,
		give: this.give,
	}
}
