var assert = require('assert');
var USERTest = require("../user");
var mahJongRoom = require("../mahjongRoom");
const EventEmitter = require('events');

class USER extends USERTest{
  talk(data) {


  }
}


describe('User', function() {
    describe('#setRoomPos', function() {
      it('设置用户在房间的位置', function() {
        var user=new USER(new EventEmitter());
        user.setRoomPos(2);
        assert.equal(user.getRoomPos(), 2);
      });
    });


    describe('#setHandCards', function() {
      it('设置用户手牌', function() {
        var user=new USER(new EventEmitter());
        user.setHandCards([0,1,2,3,4]);
        assert.equal(user.getHandCards().toString(), [1,1,1,1,1,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
      });
    });

    describe('#addMahjongCard', function() {
      it('插入单个手牌', function() {
        var user=new USER(new EventEmitter());
        user.addMahjongCard(2);
        assert.equal(user.getHandCards().toString(), [0,0,1,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
        user.addMahjongCard(3);
        assert.equal(user.getHandCards().toString(), [0,0,1,1,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
      });
    });

    describe('#removeMahjongCard', function() {
      it('删除手牌', function() {
        var user=new USER(new EventEmitter());
        user.setHandCards([6,7,8,9,1,2,4]);
        user.removeMahjongCard(6);      
        assert.equal(user.getHandCards().toString(), [0,1,1,0,1,0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0].toString());
      });
    });

    describe('#clearHandCards', function() {
      it('清空手牌', function() {
        var user=new USER(new EventEmitter());
        user.setHandCards([6,7,8,9,1,2,4]);
        user.clearHandCards();      
        assert.equal(user.getHandCards().toString(), [0,0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString());
      });
    });

    describe('#cardsCount', function() {
      it('手牌数量', function() {
        var user=new USER(new EventEmitter());
        user.setHandCards([6,7,8,9,1,2,4]);   
        assert.equal(user.cardsCount(), 7);
      });
    });
});



class mahjongRoomTest extends mahJongRoom{
    getCurrentState(){
      return this.fsmMachine.getCurrentState();
    }
};

describe('mahjongRoom', function() {
  describe('#addUser', function() {
    it('用户加入房间', function() {
      var room= new mahjongRoomTest();
      var user1=new USER(new EventEmitter());
      var user2=new USER(new EventEmitter());
      var user3=new USER(new EventEmitter());
      room.addUser(user1);
      room.addUser(user2);
      room.addUser(user3);
      assert.equal(user1.cardsCount(), 11);
      assert.equal(user2.cardsCount(), 10);
      assert.equal(user3.cardsCount(), 10);
      assert.equal(room.getCurrentState(), "waitForUserPlay");
    });

  });


});