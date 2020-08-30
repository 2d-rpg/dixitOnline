/**
 * restart
 */

const utils = require('../utils');

class Restart {

    constructor() {}

    static do(io, socket, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        game.deletePlayer(socket.id);
        io.sockets.emit('update_number_of_player', { num: game.players.length });
        console.log('delete');
        socket.emit('restart');
    }
}

module.exports = Restart;
