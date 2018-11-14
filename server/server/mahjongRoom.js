const EventEmitter = require('events');
var Shuffle = require('shuffle');
var FSM = require("./common/finiteStateMachine");
var msgDef = require("./common/def");
var mahjongCards = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9,
    10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17
];

class mahjongRoom extends EventEmitter {
    constructor() {
        super();
        this.maxUsers = 3;
        this.users = [];
        this.deck = null;
        this.currentPlayer = null;
        this.bankerPos = 0;//记录庄家位置
        this.fsmMachine = new FSM;
        this.fsmMachine.addStateMethod("waittingForJoin", null);
        this.fsmMachine.addStateMethod("waittingForReady", this.waitForUserReady.bind(this));
        this.fsmMachine.addStateMethod("gameStarting", this.startGame.bind(this));
        this.fsmMachine.addStateMethod("userTouchCard", this.touchCard.bind(this));
        this.fsmMachine.addStateMethod("waitForUserPlay", this.waitingForUserPlay.bind(this));
        this.fsmMachine.addTransition("userJoinDone", "waittingForReady");
        this.fsmMachine.addTransition("allUserReady", "gameStarting");
        this.fsmMachine.addTransition("gameStarted", "userTouchCard");
        this.fsmMachine.addTransition("touchCardEnd", "waitForUserPlay");
        this.fsmMachine.addTransition("userPlayEnd", "userTouchCard");
        this.fsmMachine.setInitialState("waittingForJoin");
    }

    touchCard() {
        if(this.deck.length === 0){
            return;
        }
        var card = this.deck.draw(1);
        this.currentPlayer.addMahjongCard(card);
        this.currentPlayer.talk({msgType: "touchCard", msgData: card});
        this.fsmMachine.process("touchCardEnd");
    }

    waitForUserReady() {
        /**
         * 准备状态检测没有做
         *
         */
        if (this.checkAllUserIsReady()) {
            this.fsmMachine.process("allUserReady");
        }
    }

    waitingForUserPlay() {
        this.currentPlayer.once(msgDef.playingMahjongCard, this.onUserPlayCard.bind(this));
    }

    onUserPlayCard(data, sender) {
        this.currentPlayer.removeMahjongCard(data);
        this.sendToOtherPlayerMsg(this.currentPlayer, {
            msgType: msgDef.playingMahjongCard,
            msgData: {userPos: this.currentPlayer.getRoomPos(), card: data}
        });
        this.currentPlayer = this.getNextUser();
        this.fsmMachine.process("userPlayEnd");
    }

    getNextUser() {
        return this.users[(this.currentPlayer.getRoomPos() + 1) % 3];
    }

    sendToOtherPlayerMsg(user, data) {
        for (var i = 0; i < this.users.length; ++i) {
            if (i !== user.getRoomPos()) {
                this.users[i].talk(data);
            }
        }
    }

    startGame() {
        this.shuffleCards();
        var playerCards = [this.deck.draw(10), this.deck.draw(10), this.deck.draw(10)];
        for (var i = 0; i < this.users.length; ++i) {
            this.users[i].setHandCards(playerCards[i]);
            this.users[i].talk({msgType: "initMahjongCards", msgData: playerCards[i]});
        }
        this.currentPlayer = this.users[this.bankerPos];
        this.fsmMachine.process("gameStarted");
    }

    checkAllUserIsReady() {
        for (var i = 0; i < this.users.length; ++i) {
            if (!this.users[i].isReady()) {
                return false;
            }
        }
        return true;
    }

    addUser(user) {
        user.setRoomPos(this.users.length);
        this.users.push(user);
        if (this.users.length === this.maxUsers) {
            this.fsmMachine.process("userJoinDone");
        }
    }

    shuffleCards() {
        if (this.deck) {
            this.deck.reset();
            this.deck.shuffle();
            return;
        }
        this.deck = Shuffle.shuffle({deck: mahjongCards.concat()});
    }
}

module.exports = mahjongRoom;