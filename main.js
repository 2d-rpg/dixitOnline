'use strict';
// サーバーサイド

// 必要なモジュールを読み込む
const express = require('express');
const http = require('http');
const path = require('path');
const Player = require('./src/modules/player');
// const fs = require('fs');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// プレイヤーリスト
let players = {};
// 接続が完了したときに呼び出す関数
io.on('connection', function(socket) {
    let player = null;
    // ゲーム開始時の処理
    socket.on('init', (config) => {
        if (Object.keys(players).length <= 3) { // 接続人数が3人以下のとき
            console.log('[debug] socket id: ' + socket.id + 'was added')
        } else { // 3人より多い場合
            io.to(socket.id).emit('cannot_play');
            return;
        }
    });
    // クライアントからentryがemitされた時の処理
    socket.on('entry', function(data) {
        if (Object.keys(players).length <= 3) { // プレイヤー人数が3人以下の時
            let player = new Player({socketId: socket.id, username: data.username});
            players[player.socketId] = player;
            io.sockets.emit('update_number_of_player', {num : Object.keys(players).length});
            player.done();
            // emitしてきたクライアントだけに投げる
            io.to(socket.id).emit('entry_done', {});
            console.log('[debug] ユーザー名: ' + player.name + 'さんが参加しました');
            console.log('[debug] ユーザー名: ' + player.name + 'さんのsocketIdは' + player.socketId + 'です');
        } else {
            return;
        }
    });
    // クライアントからwaitingがemitされた時の処理
    socket.on('master_hand_selection', () => {
        if(!player) {return;}
        // 処理
    });
    // 通信終了時(ブラウザを閉じる/リロード/ページ移動)の処理
    socket.on('disconnect', () => {
        if(!player){return;}
        delete players[player.id];
        console.log('[debug] delete' + socket.id);
        player = null;
        io.sockets.emit('update_number_of_player', {num : Object.keys(players).length});
    });
    // メッセージ用
    socket.on('client_to_server', function(data) {
        io.sockets.emit('server_to_client', {value : data.value});
    });
});

setInterval(function() {
    // 全てのプレイヤーの状態を確認
    var isAllDone = Object.values(players).filter(player => player.isDone()).length === 3;
    if (isAllDone) { // 全てのプレイヤーが次のステージにいける状態
        let nextStage = null;
        Object.values(players).forEach(player => {
            nextStage = player.nextStage(); // 次のステージ取得
            player.reset(); // 状態リセット
            // ステージ移行
            io.to(player.socketId).emit(nextStage);
        });
        console.log('[debug] ステージ' + nextStage + 'に移行');
    }
    // プレイヤーの状態をemit
    // io.sockets.emit('state', players);
}, 1000/30);

app.use('/', express.static(__dirname + '/src'));

// HTTPサーバを生成する
// サーバー生成時にfunction以下のリクエストリスナーが登録されるため
// クライアントからHTTPリクエストが送信されるたびにfunctionが実行される
// ここではヘッダ出力(writeHead)とindex.htmlの出力(readFileSync)
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/index.html'));
});

server.listen(3000, function() {
  console.log('[debug] Starting server on port 3000');
});