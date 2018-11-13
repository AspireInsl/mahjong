
var serverSocket = require("./serverSocket");
var GameConnection = require("./gameConnection");
var User = require("./user");


class gameServer {
    constructor(port) {
        var roomServer = new serverSocket(port);
        roomServer.on("connected", this.onConnected.bind(this));

    }

    onConnected(ws) {
        var gameConn = new GameConnection(ws);
        gameConn.on("gameConnectReady", this.onConnectReady.bind(this));
    }

    onConnectReady(ws) {
        var user = new User(ws);
        this.onUserJoinGame(user);
    }

    onUserJoinGame(user) {

    }
}

module.exports = gameServer;
