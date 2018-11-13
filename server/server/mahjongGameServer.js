var GameServer = require("./gameServer");
var Room = require("./mahjongRoom");

//var FSM=require("fsm");
class mahjongGameServer extends GameServer {
    constructor() {
        super(9527);
        this.room = new Room;
    }

    onUserJoinGame(user) {
        this.room.addUser(user);
    }
}

module.exports = mahjongGameServer;