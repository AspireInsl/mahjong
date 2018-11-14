var assert = require('assert');
var USERTest = require("../user");
var mahJongRoom = require("../mahjongRoom");
var msgDef = require("../common/def");
const EventEmitter = require('events');

class USER extends USERTest {
    talk(data) {
        this.currentRecvMsgData = data;
    }

    getCurrentRecvMsg() {
        return this.currentRecvMsgData;
    }

    playingCard(card) {
        this.onIncoming(JSON.stringify({msgType: msgDef.playingMahjongCard, msgData: card}));
    }
}


describe('User', function () {
    describe('#setRoomPos', function () {
        it('设置用户在房间的位置', function () {
            var user = new USER(new EventEmitter());
            user.setRoomPos(2);
            assert.equal(user.getRoomPos(), 2);
        });
    });


    describe('#setHandCards', function () {
        it('设置用户手牌', function () {
            var user = new USER(new EventEmitter());
            user.setHandCards([0, 1, 2, 3, 4]);
            assert.equal(user.getHandCards().toString(), [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
        });
    });

    describe('#addMahjongCard', function () {
        it('插入单个手牌', function () {
            var user = new USER(new EventEmitter());
            user.addMahjongCard(2);
            assert.equal(user.getHandCards().toString(), [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
            user.addMahjongCard(3);
            assert.equal(user.getHandCards().toString(), [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
        });
    });

    describe('#removeMahjongCard', function () {
        it('删除手牌', function () {
            var user = new USER(new EventEmitter());
            user.setHandCards([6, 7, 8, 9, 1, 2, 4]);
            user.removeMahjongCard(6);
            assert.equal(user.getHandCards().toString(), [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0].toString());
        });
    });

    describe('#clearHandCards', function () {
        it('清空手牌', function () {
            var user = new USER(new EventEmitter());
            user.setHandCards([6, 7, 8, 9, 1, 2, 4]);
            user.clearHandCards();
            assert.equal(user.getHandCards().toString(), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
        });
    });

    describe('#cardsCount', function () {
        it('手牌数量', function () {
            var user = new USER(new EventEmitter());
            user.setHandCards([6, 7, 8, 9, 1, 2, 4]);
            assert.equal(user.cardsCount(), 7);
        });
    });
});


class mahjongRoomTest extends mahJongRoom {
    getCurrentState() {
        return this.fsmMachine.getCurrentState();
    }

    getCurrentUser() {
        return this.currentPlayer;
    }
};


describe('mahjongRoom', function () {

    /*
    * 用户加入房间
    * 1.当加入房间人数满了之后，开始游戏。
    * 2.庄家发11张牌，其余用户发10张牌。
    * 3.等待庄家打牌。
    * */
    describe('#addUser', function () {
        it('用户加入房间', function () {
            var room = new mahjongRoomTest();
            var user1 = new USER(new EventEmitter());
            var user2 = new USER(new EventEmitter());
            var user3 = new USER(new EventEmitter());
            room.addUser(user1);
            room.addUser(user2);
            room.addUser(user3);
            assert.equal(user1.cardsCount(), 11);
            assert.equal(user2.cardsCount(), 10);
            assert.equal(user3.cardsCount(), 10);
            assert.equal(room.getCurrentState(), "waitForUserPlay");
        });
    });

    /*
    * 用户打牌
    * 1.服务器删除该用户的手牌。
    * 2.将当前打牌用户轮询到下一个用户。
    * 3.发送打牌消息给其它用户。
    * 4.下一个用户开始摸牌。
    * 5.当前状态为等待用户打牌状态。
    * */
    describe('#addUser', function () {
        it('用户加入房间', function () {
            var room = new mahjongRoomTest();
            var user1 = new USER(new EventEmitter());
            var user2 = new USER(new EventEmitter());
            var user3 = new USER(new EventEmitter());
            room.addUser(user1);
            room.addUser(user2);
            room.addUser(user3);

            var playCard = 0;
            var handCards = user1.getHandCards();
            var carNumber = 0;
            for (var i = 0; i < handCards.length; ++i) {
                if (handCards[i] > 0) {
                    playCard = i;
                    carNumber = handCards[i];
                    break;
                }
            }
            user1.playingCard(playCard);
            handCards = user1.getHandCards();
            assert.equal(handCards[playCard], carNumber - 1);
            assert.equal(user1.cardsCount(), 10);
            assert.equal(room.getCurrentUser(), user2);
            assert.equal(room.getCurrentState(), "waitForUserPlay");

            var user2RecvMsg = user2.getCurrentRecvMsg();
            assert.equal(user2.cardsCount(), 11);
            assert.equal(user2RecvMsg.msgType === msgDef.touchCard, true);

            var user3RecvMsg = user3.getCurrentRecvMsg();
            assert.equal(user3.cardsCount(), 10);
            assert.equal(user3RecvMsg.msgType === msgDef.playingMahjongCard, true);
            assert.equal(user3RecvMsg.msgData.card === playCard, true);
            assert.equal(user3RecvMsg.msgData.userPos === user1.getRoomPos(), true);
        });
    });

});