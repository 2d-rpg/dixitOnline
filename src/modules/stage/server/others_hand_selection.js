// init

const utils = require('../../utils');

class OthersHandSelection {

    constructor() {}

    static do(socket, io, index, game) {
        
        let player = game.findPlayer(socket.id);
        player.selectFromHand(index);
        player.done();
    }
}

module.exports = OthersHandSelection;