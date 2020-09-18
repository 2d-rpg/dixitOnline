// エントリー完了時

const utils = require('../utils');

class RoomEntry {
    static do(data, io, socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        socket.join(data.roomname);
        let room = roomManager.findRoomByName(data.roomname);
        room.entry(player);
        if (room.players.length > 1) {
            player.done();
        } else {
            player.isMaster = true;
        }
        // room.players.forEach(player => console.log(player.socketId));
        io.to(data.roomname).emit('entry_player', {room: room});
        io.to(data.roomname).emit('update_player_list', {game: room.game});
    }
}

module.exports = RoomEntry;