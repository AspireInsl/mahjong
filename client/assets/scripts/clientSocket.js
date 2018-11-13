var HashMap = require("hashmap");
const EventEmitter = require('events');

class clientSocket extends EventEmitter {
    constructor(host, port) {
        super();
        var ws = new WebSocket("ws://" + host + ":" + port);
        ws.onopen = this.onOpen;
        ws.onmessage = this.onMessage.bind(this);
        ws.onerror = this.onError;
        ws.onclose = this.onClose;
    }

    onOpen(event) {
        event.currentTarget.send(JSON.stringify({userName: "yan.kebiao", passWord: "adgj.1357"}));
    }

    onMessage(event) {
        var data;
        try {
            data = JSON.parse(event.data);
        } catch (err) {
            console.log(err);
            return;
        }
        if (!data.msgType || !data.msgData) {
            return;
        }
        this.emit(data.msgType, data.msgData);
    }

    onError(event) {
        console.log("error:", event);
    }

    onClose(event) {
        console.log("close:", event);
    }
}


module.exports = clientSocket;