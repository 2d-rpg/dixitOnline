
const utils = require('../utils');

class RoundEnd {

    static do(socket, game) {
        game.findPlayer(socket.id).draw(game.stock);
        game.findPlayer(socket.id).done();
    }
}

module.exports = RoundEnd;