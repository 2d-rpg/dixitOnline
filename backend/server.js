'use strict';
// サーバーサイド

// 必要なモジュールを読み込む
const express = require('express');
const http = require('http');
const path = require('path');
const utils = require('./src/scripts/utils');
const Game = require('./src/scripts/game');
// ステージごとのファイル読み込み
const wait = require('./src/scripts/stage/wait');
const init = require('./src/scripts/stage/init');
const entry = require('./src/scripts/stage/entry');
const start = require('./src/scripts/stage/start');
const story_selection = require('./src/scripts/stage/story_selection');
const others_hand_selection = require('./src/scripts/stage/others_hand_selection');
const field_selection = require('./src/scripts/stage/field_selection');

const disconnect = require('./src/scripts/stage/disconnect');
// const fs = require('fs');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// ゲームオブジェクト作成
let game = new Game();
// 接続が完了したときに呼び出す関数
io.on('connection', function(socket) {
    //行動する必要がない時
    socket.on('wait', () => wait.do(socket, game));
    // クライアント接続時
    socket.on('init', (config) => init.do(config, io, socket, game));
    // クライアントからentryがemitされた時
    socket.on('entry', (data) =>  entry.do(data, io, socket, game));
    // クライアントからstartがemitされた時
    socket.on('start', () => start.do(socket, game));
    //クライアントからstory_selectionがemitされた時
    socket.on('story_selection', (data) => story_selection.do(socket, io, data.message,data.masterIndex, game));
    //クライアントからstory_selectionがemitされた時
    socket.on('others_hand_selection', (data) => others_hand_selection.do(socket, io, data.index, game));
    //クライアントからfield_selecitonがemitされた時
    socket.on('field_selection', (data) => field_selection.do(socket, data.index, game));
    // TODO: ここに追加していく

    // 通信終了時(ブラウザを閉じる/リロード/ページ移動)
    // TODO: つまりリロードすると復帰不可
    socket.on('disconnect', () => disconnect.do(io, socket, game));
    // メッセージ用
    socket.on('chat_send_from_client', function(data) {
        io.sockets.emit('chat_send_from_server', {value : data.value});
    });
});

setInterval(function() {
    // 全プレイヤーがステージ移行可能ならば移行する
    if (game.isAllDone()) { // 全てのプレイヤーが次のステージにいける状態
        game.nextStage(io);
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

server.listen(4001, function() {
  utils.log('Starting server on port 4001');
});