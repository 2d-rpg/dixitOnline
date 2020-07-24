
const utils = require('../utils');

class FieldSelection {

    static do(socket, index, game) {
        // 答えを集計
        utils.logWithStage(game.stage, 'socket id: [' + socket.id + ']\'s Player was selected.');
        let id = socket.id;
        let answer = index;
        let dict = {}
        dict['id'] = id;
        dict['answer'] = answer;
        game.answers.push(dict);
        game.findPlayer(id).done();
    }
}

module.exports = FieldSelection;