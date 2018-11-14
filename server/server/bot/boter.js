var WebSocket = require("ws");
var msgDef = require("../common/def");

class boter {
    constructor(host, port) {
        this.ws = new WebSocket("ws://" + host + ":" + port);
        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("message", this.onMessage.bind(this));
    }

    onOpen() {
        this.ws.send(JSON.stringify({userName: "yan.kebiao", passWord: "adgj.1357"}));
    }

    onMessage(data) {
        data = JSON.parse(data);
        switch (data.msgType) {
            case msgDef.touchCard: {
                this.ws.send(JSON.stringify({
                    msgType: msgDef.playingMahjongCard,
                    msgData: data.msgData
                }));
            }
                break;
            default:
                break;
        }
    }
}

module.exports = boter;