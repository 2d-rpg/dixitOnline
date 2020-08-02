// init

const utils = require('../utils');

class OthersHandSelection {

    constructor() {}

    static do(socket, io, index, game) {
        let player = game.findPlayer(socket.id);
        if(!player.isDone()){
            player.selectFromHand(index);
            player.done();
        }
        let card = player.hand.pop();
        game.field.add(card, game);
        socket.emit('update_hand',{player:player});
    }
}

module.exports = OthersHandSelection;