class ConfirmAnswer {

    static do(socket, roomManager) {
        roomManager.findPlayer(socket).done();
    }
}

module.exports = ConfirmAnswer;