class ShowAnswer {

    constructor() {}

    static do(socket, game) {
        //スコア計算
        const answerIndex = game.field.masterCardIndex();
        const player = game.findPlayer(socket.id);
        const answers = game.answers;
        const previous = player.score;
        console.log('[debug] BEFORE ' + player.name + ': ' + player.score);
        if(answers.every(value => value.cardIndex === answerIndex)) {// 全員正解の場合
            if(!player.isMaster) {// 子
                player.score += 2;
            }
        } else if (answers.every(value => value.cardIndex !== answerIndex)) {// 全員不正解の場合
            if(!player.isMaster) {// 子
                player.score += 2;
                // 間違えさせた分
                const count = answers.filter(answer => game.field.cards[answer.cardIndex].player === player.socketId).length;
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
                const count = answers.filter(answer => game.field.cards[answer.cardIndex].player.socketId === player.socketId).length;
                player.score += count; //
            }
        }
        socket.emit('score_diff', { previous: previous, new: player.score, diff: player.score - previous });
        console.log('[debug] AFTER ' + player.name + ': ' + player.score);
    }
}

module.exports = ShowAnswer;