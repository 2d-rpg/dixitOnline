// entry

const Player = require('../../player');
const utils = require('../../utils');

class Entry {

    constructor() {}

    static do(data, io, socket, game) {
        if (players.length < 3) { // プレイヤー人数が3人未満の時
            let player = game.addPlayer(data, socket);
            io.sockets.emit('update_number_of_player', {num : game.players.length});
            // emitしてきたクライアントだけに投げる
            // io.to(socket.id).emit('entry_done', player);
            utils.logWithStage('entry', 'Player Name: [' + player.name + '] ([' 
                + player.socketId + ']) joined.');
        } else {
            io.to(socket.id).emit('cannot_play');
        }
    }

    static done(socket, game) {
        // 処理
        let player = game.findPlayer(socket.id); // socket IDからプレイヤー特定
        player.done();
        utils.logWithStage('entry_done', 'socket ID: [' + player.socketId + ']');
    }
}

module.exports = Entry;