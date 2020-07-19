// init

const utils = require('../utils');

class Wait {

    constructor() {}

    static do(socket, game) {
        let player = game.findPlayer(socket.id);
        player.done();
    }
}

module.exports = Wait;