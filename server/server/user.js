const EventEmitter = require('events');

class user extends EventEmitter {
    constructor(ws) {
        super();
        this.ws = ws;
        this.ws.on("message", this.onIncoming.bind(this))
    }

    onIncoming(data) {
        this.emit(data.eventName, data.eventData);
    }

    talk(data) {
        this.ws.send(JSON.stringify(data));
    }
}

module.exports = user;