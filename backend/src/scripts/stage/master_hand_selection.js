// init

const utils = require('../utils');

class MasterHandSelection {

    constructor() {}

    static do(socket, io, index, game) {
        let player = game.findPlayer(socket.id);
        player.selectFromHand(index);
        game.players.forEach(player => { // 全プレイヤーの状態更新
            player.done(); // 状態リセット
        });
        let card = player.hand.pop();
        game.field.add(card, game);
        socket.emit('update_hand',{player:player});
    }
}

module.exports = MasterHandSelection;