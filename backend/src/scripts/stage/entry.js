// エントリー完了時

const utils = require('../utils');

class Entry {

    constructor() {}

    static do(data, io, socket, roomContainer) {
        if (roomContainer.players.length < 10) { // プレイヤー人数が3人未満の時
            // プレイヤー追加
            let player = roomContainer.addPlayer(data, socket);
            console.log(socket.handshake.quey);
            // 全クライアントのプレイヤー人数表示更新
            io.sockets.emit('update_number_of_player', {num : roomContainer.players.length});
            socket.emit('room', {roomContainer : roomContainer});
            // game.players.forEach(player => {
            //     io.to(player.socketId).emit('update_player_list',{game : game});
            // });
            utils.logWithStage('entry', 'Player Name: [' + player.name + '] ([' 
                + player.socketId + ']) joined.');
        } else {
            // プレイできない
            io.to(socket.id).emit('cannot_play');
        }
    }

}

module.exports = Entry;