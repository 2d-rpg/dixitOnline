// init

const utils = require('../../utils');

class Wait {

    constructor() {}

    static do(socket, io, index, game) {
        console.log("wait");
        let player = game.findPlayer(socket.id);
        player.done();
    }
}

module.exports = Wait;