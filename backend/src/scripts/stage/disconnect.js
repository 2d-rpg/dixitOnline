// disconnect

const utils = require('../utils');

class Disconnect {

    static do(socket, roomManager) {
        let room = roomManager.findRoomBySocket(socket);
        if (room != null) {
            socket.leave(room.name);
            const player = roomManager.findPlayer(socket);
            player.disconnect();
            room.game.field.cards.filter(card => card.player === socket.id)
                .forEach(card => card.player = player.name);
        }
    }
}

module.exports = Disconnect;