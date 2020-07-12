'use strict';
// import modules
const Stack = require('./stack');
const Hand = require('./hand');
const Discard = require('./discard');
const Layout = require('./layout');

// プレイヤークラス
class Player {
    // 静的プロパティ(外からのアクセス可)
    // 最大スコア(終了条件に用いる)

    static count = 0;
    
    static nowMaster = 0;

    constructor(obj){
        // 初期化
        this.socketId = obj.socketId;
        this.hand = new Hand(6);
        this.isMaster = false;
        this.score = 0;
        this.name = obj.username;
        this.state = 'undone';
        this.order = Player.count;
        Player.count += 1;
        // カードの状態をstackからhandに変更
        this.hand._array.forEach(card => {
            card.nextStatus();
        });
    }
    // 山札からドロー
    draw(){
        drawCard = stock.pop(); // 山場からpop
        this.hand.add(drawCard); // 手札にadd
    }
    // 手札からカードを選択
    selectFromHand(index){
        this.hand.select(index);
    }
    // 場札からカードを選択
    selectFromLayout(index){
        layout.select(index);
    }
    // 行動終了
    done() {
        this.state = 'done';
    }
    // 行動中
    reset() {
        this.state = 'undone';
    }    
    // 行動が終わっているか
    isDone() {
        return this.state === 'done';
    }
    setMaster() {
        this.isMaster = Player.nowMaster === this.order;
    }
}

module.exports = Player;