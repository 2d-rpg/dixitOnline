const game = require('../game');

class FieldSelection {

    constructor() {
        answers = []
    }

    static do(socket, io, data) {
        // 答えを集計
        id = game.findPlayer(socket.id).socketId;
        answer = data.answer;
        dict = {}
        dict['id'] = id;
        dict['answer'] = answer
        answers.push(dict);
        while(true){
            if(answers.size === game.players.size-1){
                game.answers = this.answers
                break;
            }
        }
    }
}

module.exports = FieldSelection;