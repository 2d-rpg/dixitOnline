// story_selection

const utils = require('../utils');

class StorySelection {

    constructor() {}

    static do(socket, io, message, masterIndex, game) {
        game.setMasterClaim(message);
        let player = game.findPlayer(socket.id);
        player.selectFromHand(masterIndex);
        //player.done();

        let card = player.hand.pop();
        game.field.add(card, game);
        socket.emit('update_hand',{player:player});


        game.players.forEach(eachPlayer => {
	        eachPlayer.done()
        });
	}
}

module.exports = StorySelection;