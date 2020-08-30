
const utils = require('../utils');

class FieldSelection {

    static do(socket, io, index, roomManager) {
        // 答えを集計
        let game = roomManager.findRoomBySocket(socket).game;
        utils.logWithStage(game.stage, 'socket id: [' + socket.id + ']\'s Player was selected.');
        let id = socket.id;
        let cardIndex = index;
        let dict = {}
        dict['id'] = id;
        dict['cardIndex'] = cardIndex;
        if (game.answers.some(element => element.id === id)) {
            game.answers.filter(element => element.id === id)[0].cardIndex = cardIndex;
        } else {
            game.answers.push(dict);
        }
        // game.players.forEach(player => {
        //     io.to(player.socketId).emit('update_selected_field', { game: game });
        // });
    }
}

module.exports = FieldSelection;