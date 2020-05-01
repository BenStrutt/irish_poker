"use strict";

const Connection = (function () {
	function Connection(ip, port) {
		const ws = new WebSocket(`ws://${ip}:${port}`, "echo-protocol");

		this.logging = true;
		this.id = -1;

		ws.onmessage = this.message.bind(this);
		this.sendMessage = (message) => ws.send(JSON.stringify(message));
	}

	Connection.prototype.receiveMessage = (id, data) => console.log(`No receiveMessage method set: ${JSON.stringify({id: id, data: data})}`);

	Connection.prototype.message = function (message) {
		this.receiveMessage(JSON.parse(message.data));
	};

	Connection.prototype.log = function (msg) {
		if (!this.logging) { return; }
		console.log(msg);
	};

	return Connection;
})();
