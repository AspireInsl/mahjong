const EventEmitter = require('events');
var Shuffle = require('shuffle');
var mahjongCards = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9,
    10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17
];

class mahjongRoom extends EventEmitter {
    constructor() {
        super();
        this.maxUsers = 3;
        this.users = [];
        this.deck = null;
        // var card = deck.draw();
        // var hand = deck.draw(5);
        // var player1 = [], player2 = [], player3 = [], player4 = [];
        // deck.deal(5, [player1, player2, player3, player4]);
    }

    addUser(user) {
        if (this.users.length === this.maxUsers) {
            return;
        }
        this.users.push(user);
        if (this.users.length === this.maxUsers) {
            this.shuffleCards();
            var bankerCards = this.deck.draw(11);
            var player1 = this.deck.draw(10);
            var player2 = this.deck.draw(10);
            this.users[0].talk({msgType:"initMahjongCards",msgData:bankerCards});
            this.users[1].talk({msgType:"initMahjongCards",msgData:player1});
            this.users[2].talk({msgType:"initMahjongCards",msgData:player2});
        }
    }

    shuffleCards() {
        if (this.deck) {
            this.deck.reset();
            this.deck.shuffle();
            return;
        }
        this.deck = Shuffle.shuffle({deck: mahjongCards});
    }
}

module.exports = mahjongRoom;