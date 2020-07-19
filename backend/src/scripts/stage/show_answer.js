const game = require('../game');

class ShowAnswer {

    constructor() {}

    static do(socket, io) {
        //スコア計算
        answerIndex = game.field.masterCardIndex()
        player = game.findPlayer(socket.id);
        answers = game.answers
        tmp = []
        Object.keys(answers).forEach(answer => {
            tmp.push(answer)
        });
        if(answers.every(value => value === answers[0])) {
            if(!player.master.isMaster) {
                plyer.score += 2;
            } else {
            // 間違させた分点を追加　未記入

            }
        } else {
            if(player.master.isMaster) {
                player.score += 3;
            } else {
                dict = game.answers.filter(item => {
                    item.id === player.socketId
                })
                if(dict['answer'] == game.answerIndex) {
                    player.score += 3;
                }
            // 間違させた分点を追加　未記入

            }
        }
        //答えを表示
    }
}

module.exports = ShowAnswer;