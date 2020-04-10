"use strict";

const http = require("http");
const WebSocket = require("ws");

const Message = {
	CONNECT: 0,
	DISCONNECT: 1,
	RECONNECT: 2,
	DATA: 3,
};

function Connection(ip, port) {
	this.logging = true;

	this.id = 0;
	this.clients = {};
	this.ips = {};

	const server =  http.createServer();
	server.listen(port, ip, () => console.log(`Listening: ${ip} ${port}`));
	const WSS = new WebSocket.Server({server});
	WSS.on("connection", this.initialize.bind(this));
}

Connection.prototype.connect = (id, data) => console.log(`No connect method set: ${JSON.stringify({id: id, data: data})}`);
Connection.prototype.disconnect = (id, data) => console.log(`No disconnect method set: ${JSON.stringify({id: id, data: data})}`);
Connection.prototype.reconnect = (id, data) => console.log(`No reconnect method set: ${JSON.stringify({id: id, data: data})}`);
Connection.prototype.receiveMessage = (id, data) => console.log(`No receiveMessage method set: ${JSON.stringify({id: id, data: data})}`);

Connection.prototype.initialize = function (ws, req) {
	const data = this.processSocketRequest(ws, req);
	const id = data.id;
	const reconnect = data.reconnect;

	ws.on("close", () => this.close(id));
	ws.on("message", (_data) => this.message(id, _data));

	this.log(`${id}: ${reconnect ? "RECONNECT" : "CONNECT"}`);

	const message = {
		type: reconnect ? Message.RECONNECT : Message.CONNECT,
		info: {id: id, data: {}},
	};
	(reconnect ? this.reconnect(id, message.info.data) : this.connect(id, message.info.data));
	this.broadcast(message);
};

Connection.prototype.processSocketRequest = function (ws, req) {
	const clients = this.clients;
	const ips = this.ips;
	const ip = req.connection.remoteAddress;
	if (ips[ip] === undefined) { ips[ip] = []; }

	let id = this.id;
	let reconnect = false;
	for (let i = 0; i < ips[ip].length; ++i) {
		const cid = ips[ip][i];
		const client = clients[cid];
		if (client.readyState === WebSocket.OPEN) { continue; }
		id = cid;
		reconnect = true;
		break;
	}

	if (!reconnect) {
		ips[ip].push(id);
		++this.id;
	}
	clients[id] = ws;

	return { id: id, reconnect: reconnect };
}

Connection.prototype.close = function (id) {
	this.log(`${id}: DISCONNECT`);
	const message = {
		type: Message.DISCONNECT,
		info: {id: id, data: {}},
	};
	this.disconnect(id, message.info.data);
	this.broadcast(message, id);
};

Connection.prototype.message = function (id, data) {
	this.log(`${id}: ${data}`);
	const message = {
		type: Message.DATA,
		info: {id: id, data: JSON.parse(data)},
	};

	this.receiveMessage(id, message.info.data);
	this.broadcast(message);
};

Connection.prototype.broadcast = function (message, excludeId) {
	const clients = this.clients;
	const messageString = JSON.stringify(message);
	for (const id in clients) {
		if (id === String(excludeId)) { continue; }
		const client = clients[id];
		if (client.readyState !== WebSocket.OPEN) { continue; }
		client.send(messageString);
	}
};

Connection.prototype.log = function (msg) {
	if (!this.logging) { return; }
	console.log(msg);
};

module.exports = Connection;
