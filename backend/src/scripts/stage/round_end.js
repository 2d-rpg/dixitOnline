
const utils = require('../utils');

class RoundEnd {

    static do(socket, game) {
        game.findPlayer(socket.id).done();
    }
}

module.exports = RoundEnd;