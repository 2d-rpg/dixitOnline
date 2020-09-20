const Player = require("./player");
const Stock = require('./stock');
const Discard = require('./discard');
const Field = require('./field');
const Card = require('./card');
const utils = require('./utils');
const fs = require('fs');
const Game = require("./game");

class Room {

    constructor(name) {
        this.name = name;
        this.game = new Game();
        // this.chat = new Chat();
        this.players = [];
    }

    entry(player) {
        this.players.push(player);
        this.game.addPlayer({player: player});
        player.inRoom = 1;
        return player;
    }

    findPlayer(socket) {
        return this.players.filter(player => player.socketId === socket.id)[0];
    }

    deletePlayer(socket) {
        this.game.deletePlayer(socket);
        this.players.forEach((player, index) => {
            if (player != null && player.socketId === socket.id) {
                this.players.splice(index, 1);
                player.inRoom = 0;
                this.currentNum -= 1;
            }
        });
    }
}


module.exports = Room;