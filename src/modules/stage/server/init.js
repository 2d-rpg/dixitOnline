// init

const utils = require('../../utils');

class Init {

    constructor() {}

    static do(config, io, socket, players) {
        io.sockets.emit('update_number_of_player', {num : Object.keys(players).length});
        if (Object.keys(players).length < 3) { // プレイヤー人数が3人未満のとき
            utils.logWithStage('init', 'socket id: [' + socket.id + '] was added');
        } else { // 3人より多い場合
            io.to(socket.id).emit('cannot_play');
            utils.logWithStage('cannot_play', 'socket ID: [' + socket.id + '] cannot play game.');
        }
    }
}

module.exports = Init;