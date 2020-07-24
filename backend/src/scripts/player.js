'use strict';
// import modules
const Hand = require('./hand');

// プレイヤークラス
class Player {
    // 静的プロパティ(外からのアクセス可)
    // 最大スコア(終了条件に用いる)

    static count = 0;
    
    constructor(obj){
        // 初期化
        this.socketId = obj.socketId;
        this.hand = new Hand();
        this.isMaster = false;
        this.score = 0;
        this.name = obj.username;
        this.state = 'undone';
        Player.count += 1;
    }
    // 山札からドロー
    draw(stock){
        let drawCard = stock.pop(); // 山場からpop
        drawCard.player = this;
        drawCard.nextStatus();
        this.hand.add(drawCard); // 手札にadd
    }
    // 手札からカードを選択
    selectFromHand(index){
        console.log(index);
        this.hand.select(index);
    }

    // 手札から選択されたカード
    selectedCard(){
        return this.hand.selectedCard();
    }

    // 場札からカードを選択
    selectFromField(index){
        field.select(index);
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
}

module.exports = Player;