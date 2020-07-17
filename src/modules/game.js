const Player = require("./player");
const Stock = require('./stock');
const Discard = require('./discard');
const Field = require('./field');
const utils = require('./utils');

// private static property
// 外からのアクセス不可
// プレイヤーの状態
// ここに遷移状態を追加
const status = [
    'entry',                 // 0
    'start',                 // 1
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
        // 場札(field)
        this.field = new Field();
        // フェイズ(stage)
        this.stage = status[0];
        this.stageIndex = 0;
        // 語り部は最初に入ってきた人から
        this.master = 0;
    }

    /** プレイヤーの追加 */
    addPlayer(data, socket) {
        this.players[this.currentNum] = new Player({socketId: socket.id, username: data.username});
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
        if (this.stageIndex != Game.STAGE_NUM) {
            this.stageIndex += 1;
        } else { // 語り部更新
            this.updateMaster();
            this.stageIndex = 2;
        }
        this.stage = status[this.stageIndex]; // 'master_hand_selection'
        this.players.forEach(player => { // 全プレイヤーの状態更新
            player.reset(); // 状態リセット
        });
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
                this.players.splice(index,1)
            }    
        });
    }
}


module.exports = Game;