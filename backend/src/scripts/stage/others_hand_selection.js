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
            console.log(game.players);
            player.done();
            console.log(game.players);
        }
    }
}

module.exports = OthersHandSelection;