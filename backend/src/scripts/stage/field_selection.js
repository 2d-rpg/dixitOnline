

class FieldSelection {

    static do(socket, index, game) {
        // 答えを集計
        id = socket.id;
        answer = index;
        dict = {}
        dict['id'] = id;
        dict['answer'] = answer
        game.answers.push(dict);
        game.findPlayer(id).done();
    }
}

module.exports = FieldSelection;