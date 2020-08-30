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
        return player;
    }

}


module.exports = Room;