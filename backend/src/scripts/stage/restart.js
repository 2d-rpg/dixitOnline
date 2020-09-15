/**
 * restart
 */

const utils = require('../utils');

class Restart {

    constructor() {}

    static do(io, socket, roomManager) {
        let room = roomManager.findRoomBySocket(socket);
        let player = roomManager.findPlayer(socket);
        player.reset();
        room.game.deletePlayer(socket);
        if(room.game.players.length === 0){
            roomManager.deleteRoom(room.name);
        }
        io.sockets.emit('update_number_of_player', { num: room.game.players.length });
        socket.emit('restart', { game: room.game });
    }
}

module.exports = Restart;
