// story_selection

const utils = require('../utils');

class StorySelection {

    constructor() {}

    static do(socket, io, message, masterIndex, game) {
        game.setMasterClaim(message);
        let player = game.findPlayer(socket.id);
        player.selectFromHand(masterIndex);
        player.done();

        game.players.forEach(eachPlayer => {
	        if (player != eachPlayer) {
                io.to(eachPlayer.socketId).emit('others_hand_selection', {game : game, player : eachPlayer});
            }
        });
	}
}

module.exports = StorySelection;