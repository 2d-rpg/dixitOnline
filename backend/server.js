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
const calc_score = require('./src/scripts/stage/calc_score');
const round_end = require('./src/scripts/stage/round_end');
const restart = require('./src/scripts/stage/restart');

const disconnect = require('./src/scripts/stage/disconnect');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// ゲームオブジェクト作成
let game = new Game();
// 接続が完了したときに呼び出す関数
io.on('connection', (socket) => {
    // 行動する必要がない時
    socket.on('wait', () => wait.do(socket, game));
    // クライアント接続時
    socket.on('init', (config) => init.do(config, io, socket, game));
    // クライアントからentryがemitされた時
    socket.on('entry', (data) =>  entry.do(data, io, socket, game));
    // クライアントからstartがemitされた時
    socket.on('start', () => start.do(socket, game));
    // クライアントからstory_selectionがemitされた時
    socket.on('story_selection', (data) => story_selection.do(socket, io, data.message,data.masterIndex, game));
    // クライアントからstory_selectionがemitされた時
    socket.on('others_hand_selection', (data) => others_hand_selection.do(socket, io, data.index, game));
    // クライアントからfield_selecitonがemitされた時
    socket.on('field_selection', (data) => field_selection.do(socket, data.index, game));
    // クライアントからfield_selecitonがemitされた時
    socket.on('calc_score', () => calc_score.do(socket, game));
    // クライアントからround_endがemitされた時
    socket.on('round_end', () => round_end.do(socket, game));
    // クライアントからrestartがemitされた時
    socket.on('restart', () => restart.do(io, socket, game));

    // 通信終了時(ブラウザを閉じる/リロード/ページ移動)
    // TODO: つまりリロードすると復帰不可
    socket.on('disconnect', (reason) => disconnect.do(io, socket, game, reason));
    // メッセージ用
    socket.on('chat_send_from_client', function(data) {
        let name = 'ゲスト';
        const player = game.findPlayer(socket.id)
        if (player != null) {
            name = player.name;
        }
        io.sockets.emit('chat_send_from_server', {name: name, value : data.value});
    });
    // 画像のアップロード
    socket.on('upload', (data) => utils.uploadFile(data.filename, data.image));
});

setInterval(() => {
    // 全プレイヤーがステージ移行可能ならば移行する
    if (game.isAllDone() || game.isFinished()) { // 全てのプレイヤーが次のステージにいける状態
        game.nextStage(io);
    }
}, 1000/30);

// app.use('/', express.static(__dirname + '/src'));
// io.use((socket, next) => {
    // console.log(socket.request);
// });

// HTTPサーバを生成する
// サーバー生成時にfunction以下のリクエストリスナーが登録されるため
// クライアントからHTTPリクエストが送信されるたびにfunctionが実行される
// ここではヘッダ出力(writeHead)とindex.htmlの出力(readFileSync)
app.post('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/build/index.html'));
});


server.listen(4001, () => {
  utils.log('Starting server on port 4001');
});