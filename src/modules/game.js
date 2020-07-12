const Player = require("./player");
const Stock = require('./stock');
const Discard = require('./discard');
const Layout = require('./layout');
const utils = require('./utils');

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

class Game {

    // ゲーム終了基準点(MAX_SCORE)
    static MAX_SCORE = 30;
    // １ラウンドごとのフェイズの数(STAGE_NUM)
    static STAGE_NUM = 7;

    constructor() {
        this.players = new Array(3).fill(null);
        this.currentNum = 0;
        // 山札(stock)
        this.stock = new Stock();
        // 墓地(discard)
        this.discard = new Discard();
        // 場札(layout)
        this.layout = new Layout();
        // フェイズ(stage)
        this.stage = status[0];
        this.stageIndex = 0;
    }

    /** プレイヤーの追加 */
    addPlayer(data, socket) {
        this.players[this.currentNum] = new Player({socketId: socket.id, username: data.username});
        this.players[this.currentNum].done();
        this.currentNum += 1;
        return this.players[this.currentNum-1];
    }

    /** 次のステージへ移行 */
    nextStage() {
        // ステージ移行
        if (this.stageIndex != this.STAGE_NUM) {
            this.stageIndex += 1;
        } else { // 語り部更新
            this.stageIndex = 2;
            this.stage = status[this.stageIndex];
            this.players.forEach(player => { // 全プレイヤーの状態更新
                player.reset(); // 状態リセット
                if (this.stage == 'master_hand_selection') {
                    player.setMaster();
                }
            });
        }
        if (this.stage == 'master_hand_selection') {
            Player.nowMaster += 1;
        }
        this.players.forEach(player => { // ステージ移行
            // ディープコピー (何段階もコピーするのでObject.createは不可)
            // TODO: もっといい方法あるかも
            var others = [];
            this.players.forEach(other => {
                if (player != other) {
                    others.push(other);
                }
            });
            io.to(player.socketId).emit(this.stage, {others : others, player : player}); // ステージ移行
        });
        utils.log('Move to stage [' + this.stage + ']');
    }

    /** 全員done状態かどうか */
    isAllDone() {
        return this.players.filter(player => player.isDone()).length === 3;
    }

    /** スコア計算 */
    calcScore() {

    }

    /** 終了条件 */
    isEndGame() {
        flag = false
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
        target = null;
        this.players.forEach(player => {
            if (player.socketId == id) {
                target = player;
            }    
        });
        return target;
    }

    /** IDによるプレイヤー削除 */
    deletePlayer(id) {
        this.players.forEach(player => {
            if (player.socketId == id) {
                index = this.players.indexOf(player);
                this.players.splice(index,1)
            }    
        });
        this.currentNum -= 1;
    }
}


module.exports = Game;