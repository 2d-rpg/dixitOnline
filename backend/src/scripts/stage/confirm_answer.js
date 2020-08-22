class ConfirmAnswer {

    static do(socket, game) {
        game.findPlayer(socket.id).done();
    }
}

module.exports = ConfirmAnswer;