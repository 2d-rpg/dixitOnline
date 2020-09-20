'use strict';
// サーバーサイド

// 必要なモジュールを読み込む
const express = require('express');
const http = require('http');
const path = require('path');
const utils = require('./src/scripts/utils');
const RoomManager = require('./src/scripts/room_manager');
// ステージごとのファイル読み込み
const wait = require('./src/scripts/stage/wait');
const init = require('./src/scripts/stage/init');
const entry = require('./src/scripts/stage/entry');
const room_create = require('./src/scripts/stage/room_create');
const room_entry = require('./src/scripts/stage/room_entry');
const start = require('./src/scripts/stage/start');
const story_selection = require('./src/scripts/stage/story_selection');
const others_hand_selection = require('./src/scripts/stage/others_hand_selection');
const field_selection = require('./src/scripts/stage/field_selection');
const restart = require('./src/scripts/stage/restart');
const leave = require('./src/scripts/stage/leave');

const disconnect = require('./src/scripts/stage/disconnect');
const socketIO = require('socket.io');
const ConfirmAnswer = require('./src/scripts/stage/confirm_answer');
const ConfirmFieldSelection = require('./src/scripts/stage/confirm_field_selection');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// ゲームオブジェクト作成
let roomManager = new RoomManager();
// 接続が完了したときに呼び出す関数
io.on('connection', (socket) => {
    // 行動する必要がない時
    socket.on('wait', () => wait.do(socket, roomManager));
    // クライアント接続時
    setTimeout(() => {
        let username = socket.handshake.query['client-id'];
        let player = roomManager.findPlayerByName(username);
        let room = roomManager.findRoomByPlayerName(username);
        if (player != null) {
            if (room != null) {
                room.game.comeback(player, socket, roomManager);
                socket.join(room.name);
                // ToDo : もとのsocket削除
            } else {
                // entryはしているがroomには入っていない
                player.socketId = socket.id;
                socket.emit('room',{roomManager:roomManager});
            }
        } else {
            // entryもしていない
        }
        io.sockets.emit('update_number_of_player', { num: roomManager.players.length });
        // init.do(io, socket, roomManager);
    },100);

    // socket.on('init', (config) => init.do(config, io, socket, roomManager));
    // クライアントからentryがemitされた時
    socket.on('entry', (data) =>  entry.do(data, io, socket, roomManager));

    socket.on('room_create', (data) => room_create.do(data, io, socket, roomManager));
    socket.on('room_entry', (data) => room_entry.do(data, io, socket, roomManager));
    // クライアントからstartがemitされた時
    socket.on('start', (data) => start.do(data, socket, roomManager));
    // クライアントからstory_selectionがemitされた時
    socket.on('story_selection', (data) => story_selection.do(socket, io, data.message,data.masterIndex, roomManager));
    // クライアントからstory_selectionがemitされた時
    socket.on('others_hand_selection', (data) => others_hand_selection.do(socket, io, data.index, roomManager));
    // クライアントからfield_selecitonがemitされた時
    socket.on('field_selection', (data) => field_selection.do(socket, io, data.index, roomManager));
    // クライアントからfield_selecitonがemitされた時
    socket.on('confirm_field_selection', () => ConfirmFieldSelection.do(socket, roomManager));
    // クライアントからfield_selecitonがemitされた時
    socket.on('confirm_answer', () => ConfirmAnswer.do(socket, roomManager));
    // クライアントからround_endがemitされた時
    socket.on('round_end', () => round_end.do(socket, roomManager));
    // クライアントからrestartがemitされた時
    socket.on('restart', () => restart.do(io, socket, roomManager));
    // ルームから退出
    socket.on('leave',() => leave.do(io, socket, roomManager));
    // ToDo: deletegameに変更

    // 通信終了時(ブラウザを閉じる/リロード/ページ移動)
    // TODO: つまりリロードすると復帰不可
    socket.on('disconnect', (reason) => disconnect.do(io, socket, roomManager, reason));
    // メッセージ用
    socket.on('chat_send_from_client', function(data) {
        let name = 'ゲスト';
        const player = roomManager.findPlayer(socket)
        if (player != null) {
            name = player.name;
        }
        let roomname = roomManager.findRoomBySocket(socket).name;
        io.to(roomname).emit('chat_send_from_server', { name: name, value : data.value, socketId: socket.id });
    });
    // 画像のアップロード
    socket.on('upload', (data) => utils.uploadFile(data.filename, data.image, roomManager.findPlayer(socket).name));
});

//　削除したらroomにいるなら復帰いないなら削除

setInterval(() => {
    // 全プレイヤーがステージ移行可能ならば移行する
    roomManager.roomList.map(room => room.game).forEach(game => {
        if (game.isAllDone() || game.isFinished()) { // 全てのプレイヤーが次のステージにいける状態
            game.nextStage(io);
        }
    });
}, 1000/30);

app.use('/', express.static(__dirname + '/build'));
// io.use((socket, next) => {
    // console.log(socket.request);
// });

// HTTPサーバを生成する
// サーバー生成時にfunction以下のリクエストリスナーが登録されるため
// クライアントからHTTPリクエストが送信されるたびにfunctionが実行される
// ここではヘッダ出力(writeHead)とindex.htmlの出力(readFileSync)
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/build/index.html'));
});


server.listen(4001, () => {
  utils.log('Starting server on port 4001');
});
// server.listen(3000, () => {
//     utils.log('Starting server on port 3000');
//   });