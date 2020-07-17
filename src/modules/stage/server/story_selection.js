// init

const utils = require('../../utils');

class StorySelection {

    constructor() {}

    static do(socket, io, message, game) {
        game.setMasterClaim(message);
        //親の操作が終わったら全員の操作を終わったことにしているが、もっといい実装がありそう
        game.players.forEach(player => { // 全プレイヤーの状態更新
            player.done(); // 状態リセット
        });
    }
}

module.exports = StorySelection;