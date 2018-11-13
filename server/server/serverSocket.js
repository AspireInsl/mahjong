const WebSocket = require('ws');
const EventEmitter = require('events');

class serverSocket extends EventEmitter {
    constructor(port) {
        super();
        this.connections = [];
        const wss = new WebSocket.Server({port: port});
        var self = this;
        wss.on('connection', this.onConnected.bind(this));
    }

    onConnected(ws) {
        this.emit("connected", ws);
    }
}

module.exports = serverSocket;