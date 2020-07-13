// init

const utils = require('../../utils');

class MasterHandSelection {

    constructor() {}

    static do(socket, io, index, game) {
        //let player = game.findPlayer(socket.id);
        game.players.forEach(player => { // 全プレイヤーの状態更新
            player.done(); // 状態リセット
        });
    }
}

module.exports = MasterHandSelection;