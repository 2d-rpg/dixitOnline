const Player = require("./player");
const Stock = require('./stock');
const Discard = require('./discard');
const Field = require('./field');
const Card = require('./card');
const utils = require('./utils');
const fs = require('fs');

// private static property
// 外からのアクセス不可
// プレイヤーの状態
// ここに遷移状態を追加
const status = [
    'entry',                 // 0
    'hand_selection',        // 1
    'others_hand_selection', // 2
    'field_selection',       // 3
    'show_answer',           // 4
    'result'                 // 5
];

class Game {

    /** ゲーム終了基準点(MAX_SCORE) */
    static MAX_SCORE = 2;
    /** １ラウンドごとのフェイズの数(STAGE_NUM) */
    static STAGE_NUM = 4;
    /** カード枚数 */
    static CARD_NUM = 20;
    /** プレイヤー人数 */
    static PLAYER_NUM = 3;

    constructor() {
        /** 山札(stock) */
        this.stock = new Stock();
        /** このゲームに参加しているプレイヤー */
        this.players = [];
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
        this.master = 0;
        /** お題 */
        this.story = "";
        /** 投票の結果 */
        this.answers = [];
        this.round = 0;
        this.option = false;
    }

    reset() {
        this.stock = new Stock();
        const files = fs.readdirSync('../frontend/public/images/default/');
        for (var i = 0; i < files.length; i++) { 
            this.stock.push(new Card(files[i]));
        }
        this.stock.shuffle();
        this.discard = new Discard();
        this.field = new Field();
        this.stage = status[0];
        this.stageIndex = 0;
        this.master = 0;
    }

    createDeck(option) {
        let files;
        if (option) {
            this.option = true;
            this.players.forEach((player) => {
                files = fs.readdirSync('../frontend/public/images/uploaded/'+player.name+'/');
                for (var i = 0; i < files.length; i++) { 
                    this.stock.push(new Card('uploaded/'+player.name+'/'+files[i]));
                }
            });
        } else {
            files = fs.readdirSync('../frontend/public/images/default/');
            for (var i = 0; i < files.length; i++) { 
                this.stock.push(new Card('default/'+files[i]));
            }
        }
        this.stock.shuffle();
        this.players.forEach((player) =>  {
            for (var i = 0; i < 5; i++) { 
                player.draw(this.stock);
            }
        });
    }

    /** プレイヤーの追加 */
    addPlayer(data) {
        let player = data.player;
        // for (var i = 0; i < 5; i++) { 
        //     player.draw(this.stock);
        // }
        this.players.push(player);
        this.currentNum += 1;
        return this.players[this.currentNum-1];
    }

    /** 現在のプレイヤー数を確認 */
    // getLength() {
    //     return this.players.filter(player => player != null).length;
    // }

    /** 次のステージへ移行 */
    nextStage(io) {
        // ステージ移行
        if (this.stageIndex != Game.STAGE_NUM) {
            this.stageIndex += 1;
        } else {
            this.stageIndex = status.indexOf('hand_selection'); // hand_selectionへ
            if(this.checkScore()) { // 終了条件
                this.stageIndex = status.indexOf('result'); // result画面へ
            }
        }
        // 更新後
        if (this.stageIndex === status.indexOf('hand_selection')) { // hand_selection
            this.round += 1
            if(this.round !== 1){
                this.updateMaster(); // 語り部更新
            }
            this.fieldToDiscard();
            console.log(this.stock._array.length);
            this.players.forEach(player => player.draw(this.stock));
            if(this.stock._array.length < this.players.length) {
                this.discardToStock();
            }
            this.resetAnswers();
        } 
        if (this.stageIndex === status.indexOf('field_selection')) { // field_selection
            this.field.shuffle(); // 場札をシャッフル
        }
        if (this.stageIndex === status.indexOf('show_answer')) { // show_answer
            this.calcScore();
        }
        this.stageIndex = this.stageIndex % status.length; // restart用
        this.stage = status[this.stageIndex];
        if (this.stageIndex !== status.indexOf('entry')) {
            this.players.forEach(player => { // 全プレイヤーの状態リセット
                player.reset(); // 状態リセット
            });
            this.players.forEach(player => { // ステージ移行
                io.to(player.socketId).emit(this.stage, { player : player, game : this }); // ステージ移行
            });
        } else {
            this.reset();
        }
        utils.log('Move to stage [' + this.stage + ']');
    }

    /** 全員done状態かどうか */
    isAllDone() {
        return this.players.length >= 3 && // ゲームプレイ最低人数：３人
            this.players
            .filter(player => player != null)
            .filter(player => player.isDone()).length === this.players.length;
    }

    isFinished() {
        return this.players.filter(player => player == null).length === this.players.length && this.stageIndex === status.length;
    }

    /** 語り部の更新 */
    updateMaster() {
        this.master = (this.master + 1) % this.players.length;
        this.players.forEach((player, index) => {
            player.isMaster = this.master === index;
        });
    }

    /** 語り部によるお題の設定 */
    setStory(message){
        this.story = message;
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
        this.players.forEach((player, index) => {
            if (player != null && player.socketId == id) {
                this.players.splice(index, 1);
                this.currentNum -= 1;
            }    
        });
    }

    /** 
     * 手札のカードをフィールドに移動
     * @deprecated
     */
    handToField() {
        this.players.forEach(player => {
            let card = player.hand.pop();
            this.field.add(card, this);
            // this.field.shuffle();
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
        this.stock.shuffle();
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

    /** スコア計算 */
    calcScore() {
        const answerIndex = this.field.masterCardIndex;
        this.players.forEach(player => {
            player.prescore = player.score;
            console.log('[debug] BEFORE ' + player.name + ': ' + player.score);
            if(this.answers.every(value => value.cardIndex === answerIndex)) {// 全員正解の場合
                if(!player.isMaster) {// 子
                    player.score += 2;
                }
            } else if (this.answers.every(value => value.cardIndex !== answerIndex)) {// 全員不正解の場合
                if(!player.isMaster) {// 子
                    player.score += 2;
                    // 間違えさせた分
                    const count = this.answers.filter(answer => this.field.cards[answer.cardIndex].player === player.socketId).length;
                    player.score += count; //
                }
            } else {// 正解したが全員でない場合
                if(player.isMaster) {
                    player.score += 3;
                } else {
                    if(this.answers.filter(item => item.id === player.socketId)[0].cardIndex === answerIndex) {
                        player.score += 3;
                    }
                    // 間違えさせた分
                    const count = this.answers.filter(answer => this.field.cards[answer.cardIndex].player === player.socketId).length;
                    player.score += count; //
                }
            }
            console.log('[debug] AFTER ' + player.name + ': ' + player.score);
        });
    }
}


module.exports = Game;