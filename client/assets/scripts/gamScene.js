// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ClientSocket = require("clientSocket");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        mahjongAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        frontMahjongPrefab: {
            default: null,
            type: cc.Prefab
        },
        selfPlayingMahjongPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.lastTouchNode = null;
        this.selfMahjongLayout = this.node.getChildByName("selfMahjongLayout");
        this.adviceCard = this.selfMahjongLayout.getChildByName("adViceCard");
        this.mahjongCardsCount = 10;
        this.selfPlayingMahjongArea = this.node.getChildByName("selfPlayingMahjongArea");
        this.server = new ClientSocket("192.168.31.162", "9527");
        this.server.on("initMahjongCards", this.onRecvInitMahjongCards.bind(this));
    },

    start() {

    },
    onRecvInitMahjongCards(serverData) {
        var mahjongCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < serverData.length; ++i) {
            mahjongCards[serverData[i]]++;
        }
        this.initMahjongPosition(mahjongCards);
    },
    initMahjongPosition(mahjongData) {
        var self = this;
        var mahjongCount = 0;
        for (var i = 0; i < mahjongData.length; ++i) {
            if (mahjongData[i] <= 0) {
                continue;
            }
            for (var j = 0; j < mahjongData[i]; j++) {
                var selfMahjong = cc.instantiate(this.frontMahjongPrefab);
                var selfMahjongSprite = selfMahjong.getComponent(cc.Sprite);
                selfMahjongSprite.spriteFrame = this.mahjongAtlas.getSpriteFrame(i);
                selfMahjong.name = i + "";
                selfMahjongSprite.node.on("touchstart", function (event) {
                    if (event.target === self.lastTouchNode && self.canPlayingMahjong()) {
                        self.playingMahjong("self", self.lastTouchNode);
                        self.lastTouchNode = null;
                        return;
                    } else {
                        if (self.lastTouchNode) {
                            self.mahjongTouch(self.lastTouchNode, false);
                        }
                        self.mahjongTouch(event.target, true);
                    }
                    self.lastTouchNode = event.target;
                });
                mahjongCount++;
                //庄牌
                if (mahjongCount === this.mahjongCardsCount) {
                    this.updateAdviceCard(selfMahjong);
                    break;
                }
                this.selfMahjongLayout.addChild(selfMahjong, -1);
            }
        }
    },
    mahjongTouch(mahjongNode, isTouched) {
        mahjongNode.y = isTouched ? 15 : 0;
    },
    updateAdviceCard(mahjongNode) {
        this.adviceCard.removeAllChildren();
        if (!mahjongNode) {
            return;
        }
        this.adviceCard.addChild(mahjongNode);
    },
    playingMahjong(person, MahjongNode) {
        var playingArea = null;
        var spriteName = "";
        var childNode = null;
        switch (person) {
            case "self":
                playingArea = this.selfPlayingMahjongArea;
                childNode = cc.instantiate(this.selfPlayingMahjongPrefab);
                spriteName = "i" + MahjongNode.name;
                if (!MahjongNode.isChildOf(this.adviceCard)) {
                    this.selfMahjongLayout.removeChild(MahjongNode);
                    this.lastTouchNode.destroy();
                    if (this.adviceCard.childrenCount !== 0) {
                        var adviceNode = this.adviceCard.children[0];
                        var originChildrenCount = this.selfMahjongLayout.childrenCount;
                        for (var i = 0; i < this.selfMahjongLayout.childrenCount - 1; ++i) {
                            var child = this.selfMahjongLayout.children[i];
                            if (parseInt(adviceNode.name) < parseInt(child.name)) {
                                adviceNode.zIndex = -1;
                                this.selfMahjongLayout.insertChild(adviceNode, child.getSiblingIndex());
                                break;
                            }
                        }
                        if (originChildrenCount === this.selfMahjongLayout.childrenCount) {
                            this.selfMahjongLayout.addChild(adviceNode, -1);
                        }
                    }
                }
                this.updateAdviceCard(null);
                break;
            default:
                break;
        }
        var SpriteChild = childNode.getComponent(cc.Sprite);
        SpriteChild.spriteFrame = this.mahjongAtlas.getSpriteFrame(spriteName);
        playingArea.addChild(childNode);
    },
    canPlayingMahjong() {
        return this.adviceCard.childrenCount === 1;
    },
    // update (dt) {},
});
