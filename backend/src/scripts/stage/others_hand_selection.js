// init

const utils = require('../utils');

class OthersHandSelection {

    constructor() {}

    static do(socket, io, index, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        let player = game.findPlayer(socket.id);
        if(!player.isDone()){
            player.selectFromHand(index);
            // 手札の更新
            let card = player.hand.pop();
            game.field.add(card, game);
            socket.emit('update_hand',{ player: player });
            // フィールドの更新
            game.players.forEach(player => io.to(player.socketId).emit('update_field_with_back', { game: game }));
            if (game.players.length == 3 && game.field.cards.filter(card => card.player === player.socketId).length < 2) {
                socket.emit('others_hand_selection',{player: player, game: game});
            } else {
                player.done();
            }
        }
    }
}

module.exports = OthersHandSelection;