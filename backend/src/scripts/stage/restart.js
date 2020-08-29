/**
 * restart
 */

const utils = require('../utils');

class Restart {

    constructor() {}

    static do(io, socket, game) {
        game.deletePlayer(socket.id);
        io.sockets.emit('update_number_of_player', { num: game.getLength() });
        console.log('delete');
        socket.emit('restart', { game: game });
    }
}

module.exports = Restart;
