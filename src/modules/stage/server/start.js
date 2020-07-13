/** クライアントがスタート完了時 */
const utils = require('../../utils');

class Start {

    static do(socket, game) {
        let player = game.findPlayer(socket.id); // socket IDからプレイヤー特定
        player.done(); // スタート完了
        utils.logWithStage('entry_done', 'socket ID: [' + player.socketId + ']');
    }
}

module.exports = Start;