const Player = require("./player");
const Room = require("./room")
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
        if (this.players.length > 20) {
            player = this.players[0];
            if(fs.existsSync(utils.path+'/uploaded/'+player.name)){
                fs.rmdir(utils.path+'/uploaded/'+player.name, { recursive: true },function(err){console.log(err);});
            }
            this.deletePlayer(player.socketId);
        }
        return player;
    }

    findPlayer(socket) {
        let array = this.players.filter( player => player.socketId === socket.id );
        return array.length === 0 ? null : array[0];
    }

    /** name(client-id)によるプレイヤー検索 */
    findPlayerByName(name) {
        let array = this.players.filter( player => player.name === name );
        return array.length === 0 ? null : array[0];
    }

    createRoom(name) {
        if (name.length > 16) {
            name = name.slice(0,16);
            name = name + '...';
        } 
        let room = null;
        if (this.findRoomByName(name) == null) {
            room = new Room(name);
            this.roomList.push(room);
        }
        return room;
    }

    findRoomByName(name) {
        let array = this.roomList.filter(room => room.name === name);
        return array.length === 0 ? null : array[0];
    }

    findRoomBySocket(socket) {
        let array = this.roomList.filter(room => room.players.some(player => player.socketId === socket.id));
        return array.length === 0 ? null : array[0];
    }

    // playerのname
    findRoomByPlayerName(playerName) {
        let array = this.roomList.filter(room => room.players.some(player => player.name === playerName));
        return array.length === 0 ? null : array[0];
    }

    deleteRoom(name) {
        this.roomList.splice(this.roomList.indexOf(name), 1);
    }

    deletePlayer(id) {
        let room = this.findRoomBySocket({id:id});
        if (room != null) {
            room.deletePlayer({id:id});
        }
        this.players.forEach((player, index) => {
            if (player != null && player.socketId === id) {
                this.players.splice(index, 1);
            }    
        });
    }

}

module.exports = RoomManager;