'use strict';
// import modules
const Stack = require('./stack');
const Hand = require('./hand');
const Discard = require('./discard');
const Layout = require('./layout');

// private static property
// 外からのアクセス不可
// プレイヤーの状態
// ここに遷移状態を追加
const status = [
    'entry',                 // 0
    'waiting',               // 1
    'master_hand_selection', // 2
    'story_selection',       // 3
    'others_hand_selection', // 4
    'field_selection',       // 5
    'show_answer',           // 6
    'calc_score',            // 7
    'result'                 // 8
];

// プレイヤークラス
class Player {
    // 静的プロパティ(外からのアクセス可)
    // 最大スコア(終了条件に用いる)
    static MAX_SCORE = 30;

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
        this.stage = status[0];
        this.stageIndex = 0;
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
    // ステージ移行
    nextStage() {
        if (this.stageIndex != 7) {
            this.stageIndex += 1;
        } else { // 語り部更新
            this.stageIndex = 2;
        }
        this.stage = status[this.stageIndex];
        return this.stage;
    }
    // 行動が終わっているか
    isDone() {
        return this.state === 'done';
    }
    // 終了条件
    hasMaxScore() {
        return this.score >= MAX_SCORE;
    }
    setMaster() {
        this.isMaster = Player.nowMaster === this.order;
    }
}

module.exports = Player;