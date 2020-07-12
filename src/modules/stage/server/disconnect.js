// disconnect

const utils = require('../../utils');

class Disconnect {

    constructor() {}

    static do(io, socket, game) {
        game.deletePlayer(socket.id);
        utils.log('Delete [' + socket.id + ']');
        io.sockets.emit('update_number_of_player', {num : game.players.length});
    }
}

module.exports = Disconnect;