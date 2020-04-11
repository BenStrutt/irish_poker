"use strict";

const Connection = (function () {
	const Message = {
		CONNECT: 0,
		DISCONNECT: 1,
		RECONNECT: 2,
		DATA: 3,
	};

	function Connection(ip, port) {
		const ws = new WebSocket(`ws://${ip}:${port}`, "echo-protocol");

		this.logging = true;
		this.id = -1;

		ws.onmessage = this.message.bind(this);
		this.sendMessage = (message) => ws.send(JSON.stringify(message));
	}

	Connection.prototype.connect = (id, data) => console.log(`No connect method set: ${JSON.stringify({id: id, data: data})}`);
	Connection.prototype.disconnect = (id, data) => console.log(`No disconnect method set: ${JSON.stringify({id: id, data: data})}`);
	Connection.prototype.reconnect = (id, data) => console.log(`No reconnect method set: ${JSON.stringify({id: id, data: data})}`);
	Connection.prototype.receiveMessage = (id, data) => console.log(`No receiveMessage method set: ${JSON.stringify({id: id, data: data})}`);

	Connection.prototype.message = function (wsMessage) {
		const message = JSON.parse(wsMessage.data);
		const info = message.info;
		const id = info.id;
		const data = info.data;

		switch (message.type) {
			case Message.CONNECT: {
				if (this.id < 0) { this.id = id; };
				this.log(`${data.id === this.id ? "You" : id}: CONNECTED`);
				this.connect(id, data);
				return;
			}
			case Message.DISCONNECT: {
				this.log(`${id}: DISCONNECTED`);
				this.disconnect(id, data);
				return;
			}
			case Message.RECONNECT: {
				if (this.id < 0) { this.id = id; };
				this.log(`${id === this.id ? "You" : id}: RECONNECTED`);
				this.reconnect(id, data);
				return;
			}
			case Message.DATA: {
				this.log(`${id}: "DATA"`);
				this.receiveMessage(id, data);
				return;
			}
		}
	};

	Connection.prototype.log = function (msg) {
		if (!this.logging) { return; }
		console.log(msg);
	};

	return Connection;
})();
