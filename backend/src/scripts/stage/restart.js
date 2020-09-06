/**
 * restart
 */

const utils = require('../utils');

class Restart {

    constructor() {}

    static do(io, socket, roomManager) {
        let room = roomManager.findRoomBySocket(socket);
        room.game.deletePlayer(socket.id);
        if(room.game.players.length === 0){
            roomManager.deleteRoom(room.name);
        }
        io.sockets.emit('update_number_of_player', { num: room.game.players.length });
        socket.emit('restart', { game: room.game });
    }
}

module.exports = Restart;
