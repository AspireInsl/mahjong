const EventEmitter = require('events');

var initHandCards=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

class user extends EventEmitter {
    constructor(ws) {
        super();
        this.ws = ws;
        this.ws.on("message", this.onIncoming.bind(this));
        this.handCards = initHandCards.concat();
        this.roomPos=0;
    }
    getRoomPos(){
        return this.roomPos;
    }
    setRoomPos(pos){
        this.roomPos=pos;
    }
    onIncoming(data) {
        data=JSON.parse(data);
        this.emit(data.msgType, data.msgData, this);
    }

    talk(data) {
        this.ws.send(JSON.stringify(data));
    }

    isReady(){
        return true;
    }

    getHandCards(){
        return this.handCards;
    }

    setHandCards(handCards){
        for(var i = 0; i<handCards.length;i++){
            this.handCards[handCards[i]]++;
        }
    }

    addMahjongCard(card){
        this.handCards[card]++;
    }

    removeMahjongCard(card){
        this.handCards[card]--;
    }

    clearHandCards(){
        this.handCards = initHandCards.concat();
    }

    cardsCount(){
        var nCount=0;
        for(var i = 0 ; i < this.handCards.length ; i++){
            nCount+=this.handCards[i];
        }
        return nCount;
    }
}

module.exports = user;