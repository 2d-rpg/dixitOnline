
const utils = require('../utils');

class FieldSelection {

    static do(socket, index, game) {
        // 答えを集計
        utils.logWithStage(game.stage, 'socket id: [' + socket.id + ']\'s Player was selected.');
        let id = socket.id;
        let cardIndex = index;
        let dict = {}
        dict['id'] = id;
        dict['cardIndex'] = cardIndex;
        game.answers.push(dict);
        game.findPlayer(id).done();
    }
}

module.exports = FieldSelection;