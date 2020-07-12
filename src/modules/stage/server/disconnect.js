// disconnect

const utils = require('../../utlis');

class Disconnect {

    constructor() {}

    static do(io, socket, players) {
        delete players[socket.id];
        utils.log('Delete [' + socket.id + ']');
        io.sockets.emit('update_number_of_player', {num : Object.keys(players).length});
    }
}

module.exports = Disconnect;