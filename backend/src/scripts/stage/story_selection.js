// story_selection

const utils = require('../utils');

class StorySelection {

    constructor() {}

    static do(socket, io, message, masterIndex, game) {
        game.setStory(message);
        let player = game.findPlayer(socket.id);
        player.selectFromHand(masterIndex);
        // 手札の更新
        let card = player.hand.pop();
        game.field.add(card, game);
        socket.emit('update_hand',{player:player});
        // フィールドの更新
        game.players.forEach(player => io.to(player.socketId).emit('update_field_with_back', { game: game }));

        game.players.forEach(eachPlayer => {
	        eachPlayer.done();
        });
	}
}

module.exports = StorySelection;