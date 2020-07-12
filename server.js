'use strict';
// サーバーサイド

// 必要なモジュールを読み込む
const express = require('express');
const http = require('http');
const path = require('path');
const utils = require('./src/modules/utlis');
const Player = require('./src/modules/player');
// ステージごとのファイル読み込み
const init = require('./src/modules/stage/server/init');
const entry = require('./src/modules/stage/server/entry');
const disconnect = require('./src/modules/stage/server/disconnect');
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
    socket.on('init', (config) => init.do(config, io, socket, players));
    // クライアントからentryがemitされた時の処理
    socket.on('entry', (data) =>  entry.do(data, io, socket, players));
    // クライアントからentry_doneがemitされた時の処理
    socket.on('entry_done', () => entry.done(socket, players));
    // TODO: ここに追加していく
    // 通信終了時(ブラウザを閉じる/リロード/ページ移動)の処理
    // TODO: つまりリロードすると復帰不可
    socket.on('disconnect', () => disconnect.do(io, socket, players));
    // メッセージ用
    socket.on('chat_send_from_client', function(data) {
        io.sockets.emit('chat_send_from_server', {value : data.value});
    });
});

setInterval(function() {
    // 全てのプレイヤーの状態を確認
    var isAllDone = Object.values(players).filter(player => player.isDone()).length === 3;
    if (isAllDone) { // 全てのプレイヤーが次のステージにいける状態
        let nextStage = null;
        Object.values(players).forEach(player => { // 全プレイヤーの状態更新
            nextStage = player.nextStage(); // 次のステージ取得
            player.reset(); // 状態リセット
            if (nextStage == 'master_hand_selection') {
                player.setMaster();
            }
        });
        if (nextStage == 'master_hand_selection') {
            Player.nowMaster += 1;
        }
        Object.values(players).forEach(player => { // ステージ移行
            // ディープコピー (何段階もコピーするのでObject.createは不可)
            // TODO: もっといい方法あるかも
            var others = [];
            Object.values(players).forEach(other => {
                if (player != other) {
                    others.push(other);
                }
            });
            // delete others[player.socketId]; // 自分を削除
            io.to(player.socketId).emit(nextStage, {others : others, player : player}); // ステージ移行
        });
        utils.log('Move to stage [' + nextStage + ']');
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
  utils.log('Starting server on port 3000');
});