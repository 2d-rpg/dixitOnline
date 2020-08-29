const Player = require("./player");
const Room = require("./Room")
const Stock = require('./stock');
const Discard = require('./discard');
const Field = require('./field');
const Card = require('./card');
const utils = require('./utils');
const fs = require('fs');

class RoomContainer {
    constructor() {
        this.roomList = [];
        this.players = [];
    }

    /** プレイヤーの追加 */
    addPlayer(name, socket) {
        let player = new Player({socketId: socket.id, username: name, socket: socket});
        this.players.push(player);
        player.done(); //エントリー完了
        return player;
    }

    findPlayer(socket) {
        return this.players.filter( function(player) {
            return player.socketId === socket.id;
        })[0];
    }

    createRoom(name) {
        let room = new Room(name);
        this.roomList.push(room);
        return room;
    }

    findRoom(name) {
        return this.roomList.filter(function(room) {
            return room.name === name;
        })[0];
    }
}

module.exports = RoomContainer;