'use strict';
// import modules
const Stack = require('./stack');
const Hand = require('./hand');
const Discard = require('./discard');
const Layout = require('./layout');
// 静的プロパティ
// 山札(stock)
let stock = new Stack();
// 墓地(discard)
let discard = new Discard();
// 場札(layout)
let layout = new Layout();

// プレイヤーの状態
const status = [
    'entry',
    'waiting',
    'master_hand_select',
    'story_selection'
    // ここに遷移状態を追加
];

// プレイヤークラス
class Player {
    constructor(obj){
        // this.id = Math.floor(Math.random()*100);
        this.socketId = obj.socketId;
        this.hand = new Hand(6);
        this.isMaster = false;
        this.score = 0;
        this.name = obj.username;
        this.state = 'undone';
        this.stage = status[0];
        this.stageIndex = 0;
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
    // ステージ移行
    nextStage() {
        this.stageIndex += 1;
        this.stage = status[this.stageIndex];
        return this.stage;
    }
    // 行動が終わっているか
    isDone() {
        return this.state === 'done';
    }
    // 描画
    showHand() {
        this.hand.show();
    }
}

module.exports = Player;