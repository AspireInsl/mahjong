const EventEmitter = require('events');

class gameConnection extends EventEmitter {
    constructor(ws) {
        super();
        this.ws = ws;
        this.ws.on("message", this.dataIncoming.bind(this));
    }

    dataIncoming(data) {
        try{
            data = JSON.parse(data);
        }catch (err){
            console.log("data format error!!!!",err);
            return;
        }

        if (!data.userName || !data.passWord) {
            this.ws.removeListener("message", this.dataIncoming.bind(this));
            return;
        }
        this.emit("gameConnectReady", this.ws);
    }

}


module.exports = gameConnection;