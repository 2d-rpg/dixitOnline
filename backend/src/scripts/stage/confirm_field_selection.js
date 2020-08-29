class ConfirmFieldSelection {

    static do(socket, game) {
        game.findPlayer(socket.id).done();
        console.log('confirmed');
    }
}

module.exports = ConfirmFieldSelection;