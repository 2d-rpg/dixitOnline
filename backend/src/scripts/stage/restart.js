/**
 * restart
 */

const utils = require('../utils');

class Restart {

    constructor() {}

    static do(io, socket, roomManager) {
        let room = roomManager.findRoomBySocket(socket);
        let player = roomManager.findPlayer(socket);
        if (room !== null) {
            player.reset();
            // room.deletePlayer(socket);
            // if(room.game.players.length === 0){
            //     roomManager.deleteRoom(room.name);
            //     console.log('delete player');
            // }
            // console.log(room);
            io.sockets.emit('update_number_of_player', { num: room.game.players.length });
            room.game.addPlayer({player : player});
            var others = new Array();
            room.game.players.forEach(other => {
                if (player != other) {
                    others.push(other);
                }
            });
            if(others.length === 0) {
                console.log("aaa");
                player.isMaster = true;
            } else {
                console.log("bbb");
                player.done();
                io.to(room.game.players[0].socketId).emit('entry_player', {room : room});
            }
            console.log(room.game.players.length);
            room.game.players.forEach(player => io.to(player.socketId).emit('update_player_list', {game : room.game}));
            socket.emit('restart', {others : others, player : player, game : room.game });
        }
    }
}

module.exports = Restart;
