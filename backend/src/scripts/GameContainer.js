const Player = require("./player");
class GameContainer {
    constructor() {
        this.roomList = [];
        this.players = [];
    }

    /** プレイヤーの追加 */
    addPlayer(data, socket) {
        let player = new Player({ socketId: socket.id, username: data.username });
        this.players.push(player);
        player.done(); //エントリー完了
        return player;
    }

    findPlayer(socket) {
        return this.players.map((player) => {
            player.socketId == socket.id;
        })[0];
    }
}
exports.GameContainer = GameContainer;
