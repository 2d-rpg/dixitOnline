// エントリー完了時

const utils = require('../utils');

class RoomEntry {

    constructor() {}

    static do(data, io, socket, roomContainer) {
        let player = roomContainer.findPlayer(socket);
        let room = roomContainer.findRoom(data.roomname);
        room.entry(player);
        // 部屋全員に対してプレイヤーリスト更新をemit
        room.players.map((each) => {
            io.sockets.sockets[each.socketId].emit('update_player_list', {game: room.game});
        })
        // socket.emit('room', {roomContainer : roomContainer});
        // game.players.forEach(player => {
        //     io.to(player.socketId).emit('update_player_list',{game : game});
        // });
    }
}

module.exports = RoomEntry;