const { count } = require("../player");

class ShowAnswer {

    constructor() {}

    static do(socket, game) {
        //スコア計算
        let answerIndex = game.field.masterCardIndex();
        let player = game.findPlayer(socket.id);
        let answers = game.answers;
        let tmp = [];// {id,cardIndex}
        Object.keys(answers).forEach(answer => {
            tmp.push(answer);
        });
        if(answers.every(value => value.cardIndex === answerIndex)) {// 全員正解の場合
            if(!player.isMaster) {// 子
                player.score += 2;
            }
        } else if (answers.every(value => value.cardIndex !== answerIndex)) {// 全員不正解の場合
            if(!player.isMaster) {// 子
                player.score += 2;
                // 間違えさせた分
                let count = answers.filter(answer => game.field.cards[answer.cardIndex].player === player.socketId).length;
                player.score += count; //
            }
        } else {// 正解したが全員でない場合
            if(player.isMaster) {
                player.score += 3;
            } else {
                dict = game.answers.filter(item => {
                    item.id === player.socketId;
                })
                if(dict['cardIndex'] == game.answerIndex) {
                    player.score += 3;
                }
                // 間違えさせた分
                let count = answers.filter(answer => game.field.cards[answer.cardIndex].player.socketId === player.socketId).length;
                player.score += count; //
            }
        }
        player.done();
    }
}

module.exports = ShowAnswer;