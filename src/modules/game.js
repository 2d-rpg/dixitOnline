const Player = require("./player");
const utils = require('./utils');


class Game {

    constructor() {
        this.players = new Array(3).fill(null);
        this.currentNum = 0;
        // 山札(stock)
        this.stock = new Stack();
        // 墓地(discard)
        this.discard = new Discard();
        // 場札(layout)
        this.layout = new Layout();
    }

    /** プレイヤーの追加 */
    addPlayer(data, socket) {
        this.players[this.currentNum] = new Player({socketId: socket.id, username: data.username});
    }

    /** 次のステージへ移行 */
    nextStage() {
        let nextStage = null;
        this.players.forEach(player => { // 全プレイヤーの状態更新
            nextStage = player.nextStage(); // 次のステージ取得
            player.reset(); // 状態リセット
            if (nextStage == 'master_hand_selection') {
                player.setMaster();
            }
        });
        if (nextStage == 'master_hand_selection') {
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
            io.to(player.socketId).emit(nextStage, {others : others, player : player}); // ステージ移行
        });
        utils.log('Move to stage [' + nextStage + ']');
    }

    /** 全員done状態かどうか */
    isAllDone() {
        return this.players.filter(player => player.isDone()).length === 3;
    }
}


module.exports = Game;