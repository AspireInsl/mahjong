var HashMap = require("hashmap");
const EventEmitter = require('events');

class clientSocket extends EventEmitter {
    constructor(host, port) {
        super();
        this.ws = new WebSocket("ws://" + host + ":" + port);
        this.ws.onopen = this.onOpen;
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError;
        this.ws.onclose = this.onClose;
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

    talk(data){
        this.ws.send(JSON.stringify(data));
    }

    onError(event) {
        console.log("error:", event);
    }

    onClose(event) {
        console.log("close:", event);
    }
}


module.exports = clientSocket;