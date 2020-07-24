const Player = require("./player");
const Stock = require('./stock');
const Discard = require('./discard');
const Field = require('./field');
const Card = require('./card');
const utils = require('./utils');

// private static property
// 外からのアクセス不可
// プレイヤーの状態
// ここに遷移状態を追加
const status = [
    'entry',                 // 0
    'start',                 // 1
    'hand_selection',        // 2
    'field_selection',       // 3
    'show_answer',           // 4
    'show_score',            // 5
    'result'                 // 6
];

class Game {

    // ゲーム終了基準点(MAX_SCORE)
    static MAX_SCORE = 5;
    // １ラウンドごとのフェイズの数(STAGE_NUM)
    static STAGE_NUM = 5;
    // カード枚数
    static CARD_NUM = 20;

    constructor() {
        // 山札(stock)
        this.stock = new Stock();
        for (var i=0; i < Game.CARD_NUM; i++) { 
            this.stock.push(new Card(utils.randomSample(18)));
        }
        // プレイヤー
        this.players = new Array(3).fill(null);
        this.currentNum = 0;
        // 墓地(discard)
        this.discard = new Discard();
        // 場札(field)
        this.field = new Field();
        // フェイズ(stage)
        this.stage = status[0];
        this.stageIndex = 0;
        // 語り部は最初に入ってきた人から
        this.master = -1;
        // お題
        this.masterClaim = "";
        // 投票の結果
        this.answers = [];
    }

    /** プレイヤーの追加 */
    addPlayer(data, socket) {
        let player = new Player({socketId: socket.id, username: data.username});
        for (var i=0; i < 6; i++) { 
            player.draw(this.stock);
        }
        this.players[this.currentNum] = player;
        this.players[this.currentNum].done(); //エントリー完了
        this.currentNum += 1;
        return this.players[this.currentNum-1];
    }

    getLength() {
        return this.players.filter(player => player != null).length;
    }

    /** 次のステージへ移行 */
    nextStage(io) {
        // ステージ移行
        if (this.stageIndex != Game.STAGE_NUM) { // resu
            this.stageIndex += 1;
        } else { // 語り部更新
            this.stageIndex = 2;
            if(this.checkScore()) {
                this.stageIndex = 6;
            }
        }
        if(this.stageIndex == 2){
            this.updateMaster();
            this.fieldToDiscard();
            if(this.stock._array.length < this.players.length) {
                this.discardToStock();
            }
        } 
        if(this.stageIndex == 3){// field の更新
            this.handToField();
        }
        
        this.stage = status[this.stageIndex];
        this.players.forEach(player => { // 全プレイヤーの状態リセット
            player.reset(); // 状態リセット
        });
        this.players.forEach(player => { // ステージ移行
            // ディープコピー (何段階もコピーするのでObject.createは不可)
            // TODO: もっといい方法あるかも
            var others = new Array();
            this.players.forEach(other => {
                if (player != other) {
                    others.push(other);
                }
            });
            io.to(player.socketId).emit(this.stage, {others : others, player : player, game : this}); // ステージ移行
        });
        utils.log('Move to stage [' + this.stage + ']');
    }

    /** 全員done状態かどうか */
    isAllDone() {
        return this.players
            .filter(player => player != null)
            .filter(player => player.isDone()).length === 3;
    }

    /** 語り部の更新 */
    updateMaster() {
        this.master = (this.master + 1) % 3; // 0 ~ 2 でループ
        this.players.forEach((player, index) => {
            player.isMaster = this.master === index;
        });
    }

    setMasterClaim(message){
        this.masterClaim = message;
    }

    /** スコア計算 */
    calcScore() {

    }

    /** 終了条件 */
    isEndGame() {
        let flag = false
        this.players.forEach(player => {
            if (player.score >= 30) {
                flag = true
            }
        });
        return flag;
    }


    /** 親が誰か判定する */


    /** IDによるプレイヤー検索 */
    findPlayer(id) {
        let target = null;
        this.players.forEach(player => {
            if (player.socketId == id) {
                target = player;
            }    
        });
        return target;
    }

    /** IDによるプレイヤー削除 */
    deletePlayer(id) {
        this.players.filter(player => player != null).forEach(player => {
            if (player.socketId == id) {
                var index = this.players.indexOf(player);
                this.players.splice(index,1);
                this.currentNum -= 1;
            }    
        });
    }

    handToField() {
        this.players.forEach(player => {
            let card = player.hand.pop();
            this.field.add(card, this);
        });
    }

    fieldToDiscard() {
        const len = this.field.cards.length
        for (let i = 0; i < len; i++) {
            this.discard.push(this.field.pop());
        }
    }

    discardToStock() {
        const len = this.discard._array.length;
        for (let i = 0; i < len; i++) {
            this.stock.push(this.discard.pop());
        }
        utils.shuffle(this.stock._array);
    }

    checkScore() {
        return !this.players.every(player => player.score < Game.MAX_SCORE);
    }
}


module.exports = Game;