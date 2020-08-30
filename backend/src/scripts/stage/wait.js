/**
 * wait
 */

const utils = require('../utils');

class Wait {

    constructor() {}

    static do(socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        player.done();
    }
}

module.exports = Wait;