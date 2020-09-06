const Player = require("./player");
const Room = require("./Room")
const Stock = require('./stock');
const Discard = require('./discard');
const Field = require('./field');
const Card = require('./card');
const utils = require('./utils');
const fs = require('fs');

class RoomManager {
    constructor() {
        this.roomList = [];
        this.players = [];
    }

    /** プレイヤーの追加 */
    addPlayer(name, socket) {
        let player = new Player({socketId: socket.id, username: name, socket: socket});
        this.players.push(player);
        return player;
    }

    findPlayer(socket) {
        return this.players.filter( player => player.socketId === socket.id )[0];
    }

    createRoom(name) {
        let room = new Room(name);
        this.roomList.push(room);
        return room;
    }

    findRoomByName(name) {
        return this.roomList.filter(room => room.name === name)[0];
    }

    findRoomBySocket(socket) {
        return this.roomList.filter(room => room.players.some(player => player.socketId === socket.id))[0];
    }

    deleteRoom(name) {
        this.roomList.splice(this.roomList.indexOf(name), 1);
    }

}

module.exports = RoomManager;