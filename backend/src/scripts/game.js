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
    'others_hand_selection', // 3
    'field_selection',       // 4
    'show_answer',           // 5
    'show_score',            // 6
    'result'                 // 7
];

class Game {

    /** ゲーム終了基準点(MAX_SCORE) */
    static MAX_SCORE = 5;
    /** １ラウンドごとのフェイズの数(STAGE_NUM) */
    static STAGE_NUM = 6;
    /** カード枚数 */
    static CARD_NUM = 20;
    /** プレイヤー人数 */
    static PLAYER_NUM = 3;

    constructor() {
        /** 山札(stock) */
        this.stock = new Stock();
        for (var i = 0; i < Game.CARD_NUM; i++) { 
            this.stock.push(new Card(utils.randomSample(18)));
        }
        /** このゲームに参加しているプレイヤー */
        this.players = new Array(Game.PLAYER_NUM).fill(null);
        /** 現在のプレイヤー人数 */
        this.currentNum = 0;
        /** 墓地(discard) */
        this.discard = new Discard();
        /** 場札(field) */
        this.field = new Field();
        /** フェイズ(stage) */
        this.stage = status[0];
        this.stageIndex = 0;
        /** 語り部(最初に入ってきた人から) */
        this.master = -1;
        /** お題 */
        this.masterClaim = "";
        /** 投票の結果 */
        this.answers = [];
    }

    /** プレイヤーの追加 */
    addPlayer(data, socket) {
        let player = new Player({socketId: socket.id, username: data.username});
        for (var i = 0; i < 5; i++) { 
            player.draw(this.stock);
        }
        this.players[this.currentNum] = player;
        this.players[this.currentNum].done(); //エントリー完了
        this.currentNum += 1;
        return this.players[this.currentNum-1];
    }

    /** 現在のプレイヤー数を確認 */
    getLength() {
        return this.players.filter(player => player != null).length;
    }

    /** 次のステージへ移行 */
    nextStage(io) {
        // ステージ移行
        if (this.stageIndex != Game.STAGE_NUM) {
            this.stageIndex += 1;
        } else {
            this.stageIndex = 2; // hand_selectionへ
            if(this.checkScore()) { // 終了条件
                this.stageIndex = 7; // result画面へ
            }
        }
        if(this.stageIndex == 2){ // hand_selection
            this.updateMaster(); // 語り部更新
            this.fieldToDiscard();
            if(this.stock._array.length < this.players.length) {
                this.discardToStock();
            }
            this.players.forEach(player => player.draw(this.stock));
            this.resetAnswers();
        } 
        if(this.stageIndex == 4){// fieldの更新
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

    /** 語り部によるお題の設定 */
    setMasterClaim(message){
        this.masterClaim = message;
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

    /** socket idによるプレイヤー検索 */
    findPlayer(id) {
        let target = null;
        this.players.filter(player => player != null).forEach(player => {
            if (player.socketId == id) {
                target = player;
            }    
        });
        return target;
    }

    /** name(client-id)によるプレイヤー検索 */
    findPlayerByName(name) {
        return this.players.filter(player => player != null)
                           .find(player => player.name == name);
    }

    /** socket idによるプレイヤー削除 */
    deletePlayer(id) {
        this.players.filter(player => player != null).forEach(player => {
            if (player.socketId == id) {
                var index = this.players.indexOf(player);
                this.players.splice(index, 1);
                this.currentNum -= 1;
            }    
        });
    }

    /** 手札のカードをフィールドに移動 */
    handToField() {
        this.players.forEach(player => {
            let card = player.hand.pop();
            this.field.add(card, this);
        });
    }

    /** フィールド上のカードを墓地へ移動 */
    fieldToDiscard() {
        const len = this.field.cards.length
        for (let i = 0; i < len; i++) {
            this.discard.push(this.field.pop());
        }
    }

    /** 墓地から山札に移動 */
    discardToStock() {
        const len = this.discard._array.length;
        for (let i = 0; i < len; i++) {
            this.stock.push(this.discard.pop());
        }
        utils.shuffle(this.stock._array);
    }

    /** 最大スコアをチェックし，終了条件確認 */
    checkScore() {
        return !this.players.every(player => player.score < Game.MAX_SCORE);
    }

    /** answersのリセット */
    resetAnswers() {
        this.answers.length = 0;
    }

    /** ゲームへの復帰 */
    comeback(player, socket) {
        // socket id更新
        player.socketId = socket.id;
        player.hand._array.forEach(card => card.player = socket.id);
        var others = new Array();
        this.players.forEach(other => {
            if (player != other) {
                others.push(other);
            }
        });
        socket.emit(this.stage, {others : others, player : player, game : this});
        console.log("復帰" + this.stage);
    }
}


module.exports = Game;