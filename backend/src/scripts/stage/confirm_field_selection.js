class ConfirmFieldSelection {

    static do(socket, roomManager) {
        let game = roomManager.findRoomBySocket(socket).game;
        game.findPlayer(socket.id).done();
        console.log('confirmed');
    }
}

module.exports = ConfirmFieldSelection;