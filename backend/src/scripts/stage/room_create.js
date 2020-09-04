// エントリー完了時

const utils = require('../utils');
const room_entry = require('./room_entry');

class RoomCreate {

    static do(data, io, socket, roomManager) {
        let room = roomManager.createRoom(data.roomname);
        // 全クライアントのプレイヤー人数表示更新
        io.sockets.emit('update_number_of_player', {num : roomManager.players.length});
        io.sockets.emit('update_roomlist', {roomManager : roomManager});
        // console.log("fefe");
        // console.log(room);
        room_entry.do({roomname:room.name, game:room.game}, io, socket, roomManager);
        // game.players.forEach(player => {
        //     io.to(player.socketId).emit('update_player_list',{game : game});
        // });
    }

}

module.exports = RoomCreate;