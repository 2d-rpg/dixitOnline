// init

const utils = require('../../utils');

class StorySelection {

    constructor() {}

    static do(socket, io, message, game) {
        game.setMasterClaim(message);
        game.players.forEach(player => { // 全プレイヤーの状態更新
            player.done(); // 状態リセット
        });
    }
}

module.exports = StorySelection;