class Leave {

    constructor() {}

    static do(io, socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        let room = roomManager.findRoomBySocket(socket);
        room.deletePlayer(socket);
        socket.leave(room.name);
        player.undone();
        if (room.players.length > 0) {
            if(!player.isMaster){
                console.log("a");
            }else{
                console.log("b");
                // 親の変更
                room.players[0].isMaster = true;
            }
        } else {
            console.log("c");
            // ルームの削除
            roomManager.deleteRoom(room.name);
            io.sockets.emit('update_roomlist', {roomManager:roomManager});
        }
        io.to(player.socketId).emit('room', {roomManager:roomManager});
        io.to(room.name).emit('update_player_list', {game: room.game});
    }
}

module.exports = Leave;