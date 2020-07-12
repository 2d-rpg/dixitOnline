// entry

const Player = require('../../player');
const utils = require('../../utlis');

class Entry {

    constructor() {}

    static do(data, io, socket, players) {
        if (Object.keys(players).length < 3) { // プレイヤー人数が3人未満の時
            let player = new Player({socketId: socket.id, username: data.username});
            players[player.socketId] = player;
            io.sockets.emit('update_number_of_player', {num : Object.keys(players).length});
            player.done(); // done状態にする
            // emitしてきたクライアントだけに投げる
            // io.to(socket.id).emit('entry_done', player);
            utils.logWithStage('entry', 'Player Name: [' + player.name + '] ([' 
                + player.socketId + ']) joined.');
        } else {
            io.to(socket.id).emit('cannot_play');
        }
    }

    static done(socket, players) {
        // 処理
        let player = players[socket.id]; // socket IDからプレイヤー特定
        player.done();
        utils.logWithStage('entry_done', 'socket ID: [' + player.socketId + ']');
    }
}

module.exports = Entry;