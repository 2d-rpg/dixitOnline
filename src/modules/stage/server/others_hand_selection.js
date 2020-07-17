// init

const utils = require('../../utils');

class OthersHandSelection {

    constructor() {}

    static do(socket, io, index, game) {
        
        let player = game.findPlayer(socket.id);
        player.selectFromHand(index);
        player.done();
        //親を無理やり終了させているがもっといい実装がありそう
        game.players.forEach(player => {
            if(player.isMaster){
                player.done();//親は終了
            }
        });

    }
}

module.exports = OthersHandSelection;