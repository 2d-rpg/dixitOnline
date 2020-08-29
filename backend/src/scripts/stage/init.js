// init

const utils = require('../utils');

class Init {

    constructor() { }

    static do(config, io, socket, roomContainer) {
        io.sockets.emit('update_number_of_player', { num: roomContainer.players.length });
        // console.log(socket.handshake.query);
        // let player = gameContainer.addPlayer(data, socket);
        // if (gameContainer.players.length < 10 && game.stageIndex === 0) { // プレイヤー人数が3人未満のとき
        //     utils.logWithStage('init', 'socket id: [' + socket.id + '] was added');
        // } else { // 3人以上場合
        //     // クエリ(cookie)を取得し，ゲームへの復帰を行う
        //     const player = game.findPlayerByName(socket.handshake.query['client-id']);
        //     if (typeof player !== 'undefined') {
        //         game.comeback(player, socket);
        //     } else {
        //         console.log('cannot_play');
        //         io.to(socket.id).emit('cannot_play');
        //         utils.logWithStage('cannot_play', 'socket ID: [' + socket.id + '] cannot play game.');
        //     }
        // }
    }
}

module.exports = Init;