// エントリー完了時

class RoomEntry {
    static do(data, io, socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        if (player != null) {
            player.isMaster = false;
            socket.join(data.roomname);
            let room = roomManager.findRoomByName(data.roomname);
            room.entry(player);
            if (room.players.length > 1) {
                player.done();
            } else {
                player.isMaster = true;
            }
            io.to(data.roomname).emit('entry_player', { room: room });
            io.to(data.roomname).emit('update_player_list', { game: room.game });
        } else {
            // 人数制限によって削除される
            console.log('capacity over');
        }
    }
}

module.exports = RoomEntry;