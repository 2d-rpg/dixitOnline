// エントリー完了時

const utils = require('../utils');

class Entry {

    constructor() {}

    static do(data, io, socket, game) {
        if (game.getLength() < 3) { // プレイヤー人数が3人未満の時
            // プレイヤー追加
            let player = game.addPlayer(data, socket);
            // 全クライアントのプレイヤー人数表示更新
            io.sockets.emit('update_number_of_player', {num : game.getLength()});
            utils.logWithStage('entry', 'Player Name: [' + player.name + '] ([' 
                + player.socketId + ']) joined.');
        } else {
            // プレイできない
            io.to(socket.id).emit('cannot_play');
        }
    }

}

module.exports = Entry;