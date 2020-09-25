// エントリー完了時

const room_entry = require('./room_entry');

class RoomCreate {

    static do(data, io, socket, roomManager) {
        let room = roomManager.createRoom(data.roomname);
        if (room == null) {// 指定のroomnameが既に存在する場合
            socket.emit('room_name_overlap');
        } else {
            roomManager.findPlayer(socket).isMaster = true;
            // 全クライアントのプレイヤー人数表示更新
            io.sockets.emit('update_number_of_player', { num : roomManager.players.length });
            io.sockets.emit('update_roomlist', { roomManager : roomManager });
            socket.emit('show_start');
            room_entry.do({ roomname: room.name, game: room.game }, io, socket, roomManager);
        }
    }

}

module.exports = RoomCreate;