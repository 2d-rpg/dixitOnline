const Game = require("../game");

class Leave {

    static do(io, socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        let room = roomManager.findRoomBySocket(socket);
        room.deletePlayer(socket);
        socket.leave(room.name);
        if (room.players.length > 0) {
            if (room.game.players.length === 0) {
                room.game = room.nextGame;
                room.nextGame = new Game();
                io.sockets.emit('update_roomlist', {roomManager: roomManager});
            }
            if(player.isMaster){
                // 親の変更
                room.players[0].isMaster = true;
                room.players[0].undone();
            }
        } else {
            // ルームの削除
            roomManager.deleteRoom(room.name);
            io.sockets.emit('update_roomlist', {roomManager: roomManager});
        }
        player.reset();
        io.to(player.socketId).emit('room', {roomManager: roomManager});
        io.to(room.name).emit('update_player_list', {game: room.game});
    }
}

module.exports = Leave;