'use strict';
// サーバーサイド
// サーバーサイド：必要なモジュールを読み込む
// var http = require('http');
// var socketio = require('socket.io');
// var fs = require('fs');
// サーバーサイド：HTTPサーバを生成する
// サーバー生成時にfunction以下のリクエストリスナーが登録されるため
// クライアントからHTTPリクエストが送信されるたびにfunctionが実行される
// ここではヘッダ出力(writeHead)とindex.htmlの出力(readFileSync)
// var server = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type' : 'text/html'});
//     res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
// }).listen(3000);  // 使用するポート(ポート競合の場合は値を変更)
// サーバーサイド：HTTPサーバにソケットをひも付ける（WebSocket有効化）
// var io = socketio.listen(server);
 
// io.sockets.on('connection', function(socket) {
//     socket.on('client_to_server', function(data) {
//         io.sockets.emit('server_to_client', {value : data.value});
//     });
// });

// 必要なモジュールを読み込む
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// ゲーム画面の範囲
const FIELD_WIDTH = 1000, FIELD_HEIGHT = 1000;
// プレイヤークラス
class Player{
    constructor(obj={}){
        this.id = Math.floor(Math.random()*1000000000);
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (FIELD_WIDTH - this.width);
        this.y = Math.random() * (FIELD_HEIGHT - this.height);
        this.angle = 0;
        this.movement = {};
    }
    move(distance){
        this.x += distance * Math.cos(this.angle);
        this.y += distance * Math.sin(this.angle);
    }
};
// プレイヤーリスト
let players = {};
// 接続が完了したときに呼び出す関数
io.on('connection', function(socket) {
    let player = null;
    // ゲーム開始時の処理
    socket.on('game-start', (config) => {
        player = new Player({
            socketId: socket.id,
        });
        players[player.id] = player;
    });
    // プレイヤーの移動コマンド
    socket.on('movement', function(movement) {
        if(!player){return;}
        player.movement = movement;
    });
    // 通信終了時(ブラウザを閉じる/リロード/ページ移動)の処理
    socket.on('disconnect', () => {
        if(!player){return;}
        delete players[player.id];
        player = null;
    });
});

setInterval(function() {
    Object.values(players).forEach((player) => {
        const movement = player.movement;
        if(movement.forward){
            player.move(5);
        }
        if(movement.back){
            player.move(-5);
        }
        if(movement.left){
            player.angle -= 0.1;
        }
        if(movement.right){
            player.angle += 0.1;
        }
    });
    io.sockets.emit('state', players);
}, 1000/30);

app.use('/src', express.static(__dirname + '/src'));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/index.html'));
});

server.listen(3000, function() {
  console.log('Starting server on port 3000');
});