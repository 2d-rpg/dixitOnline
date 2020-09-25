// エントリー完了時

const utils = require('../utils');

class Entry {

    constructor() {}

    static do(data, io, socket, roomManager) {
        if (roomManager.players.length < 10) { // プレイヤー人数が3人未満の時
            if (!roomManager.players.some(player => player.name === data.username)) {
                // プレイヤー追加
                let player = roomManager.addPlayer(data.username, socket);
                // 全クライアントのプレイヤー人数表示更新
                io.sockets.emit('update_number_of_player', {num : roomManager.players.length});
                socket.emit('room', {roomManager : roomManager, player : player});
                // game.players.forEach(player => {
                //     io.to(player.socketId).emit('update_player_list',{game : game});
                // });
                setTimeout(() => {
                    utils.logWithStage('entry', 'Player Name: [' + player.name + '] ([' 
                    + player.socketId + ']) joined.');
                },200);
            } else {
                io.sockets.emit('username_duplication');
            }
        } else {
            // プレイできない
            io.to(socket.id).emit('cannot_play');
        }
    }

}

module.exports = Entry;