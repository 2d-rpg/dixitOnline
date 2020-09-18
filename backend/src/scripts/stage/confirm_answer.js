class ConfirmAnswer {

    static do(socket, roomManager) {
        roomManager.findPlayer(socket).done();
        roomManager.players.forEach(player => console.log(player));;
    }
}

module.exports = ConfirmAnswer;