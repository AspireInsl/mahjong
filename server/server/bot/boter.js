var WebSocket=require("ws");

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
        console.log("message:", data);
    }
}

module.exports = boter;