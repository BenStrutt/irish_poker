"use strict";

const http = require("http");
const WebSocket = require("ws");

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

Connection.prototype.connect = (id) => console.log(`No connect method set: ${id}`);
Connection.prototype.disconnect = (id) => console.log(`No disconnect method set: ${id}`);
Connection.prototype.reconnect = (id) => console.log(`No reconnect method set: ${id}`);
Connection.prototype.receiveMessage = (id, data) => console.log(`No receiveMessage method set: ${JSON.stringify({id: id, data: data})}`);

Connection.prototype.initialize = function (ws, req) {
	const data = this.processSocketRequest(ws, req);
	const id = data.id;
	const reconnect = data.reconnect;

	ws.on("close", () => this.close(id));
	ws.on("message", (_data) => this.message(id, _data));

	this.log(`${id}: ${reconnect ? "RECONNECT" : "CONNECT"}`);

	if (reconnect) {
		this.reconnect(id);
	} else {
		this.connect(id);
	}

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
	this.disconnect(id);
};

Connection.prototype.message = function (id, data) {
	this.log(`${id}: ${data}`);
	this.receiveMessage(id, JSON.parse(data));
};

Connection.prototype.broadcast = function (message, excludeIDs) {
	if (excludeIDs === undefined) {
		excludeIDs = [];
	}

	const clients = this.clients;
	const messageString = JSON.stringify(message);
	for (const id in clients) {
		if (excludeIDs.indexOf(Number(id)) >= 0) { continue; }
		const client = clients[id];
		if (client.readyState !== WebSocket.OPEN) { continue; }
		client.send(messageString);
	}
};

Connection.prototype.sendMessage = function (message, includeIDs) {
	const clients = this.clients;
	const messageString = JSON.stringify(message);
	for (const id in includeIDs) {
		const client = clients[id];
		if (client === undefined || client.readyState !== WebSocket.OPEN) { continue; }
		client.send(messageString);
	}
};

Connection.prototype.log = function (msg) {
	if (!this.logging) { return; }
	console.log(msg);
};

module.exports = Connection;
