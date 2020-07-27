// disconnect

const utils = require('../utils');

class Disconnect {

    constructor() {}

    static do(io, socket, game, reason) {
        // game.deletePlayer(socket.id);
        utils.logWithStage(game.stage, 'Delete [' + socket.id + ']');
        console.log(reason);
        io.to(socket.id).emit('connect');
        io.sockets.emit('update_number_of_player', {num : game.players.length});
    }
}

module.exports = Disconnect;