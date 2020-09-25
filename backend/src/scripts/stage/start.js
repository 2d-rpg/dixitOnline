'use strict';

/** クライアントがスタート完了時 */
class Start {

    static do(data, socket, roomManager) {
        let player = roomManager.findPlayer(socket);
        let room = roomManager.findRoomBySocket(socket);
        room.game.createDeck(data.option);
        player.done();
    }
}

module.exports = Start;