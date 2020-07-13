'use strict';
// クライアント側
// import modules
import {Init} from './modules/stage/client/init.js'
import {Start} from './modules/stage/client/start.js'
import {MasterHandSelection} from './modules/stage/client/master_hand_selection.js'
import {CannotPlay} from './modules/stage/client/cannot_play.js';
// const init = require('./modules/stage/client/init');
// Socket.IOを利用してサーバに接続
const socket = io();
const canvas = document.getElementById('canvas-2d');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

// サーバーから'chat_send_from_server'がemitされた時の動作(チャット用)
socket.on('chat_send_from_server', function(data){appendMsg(data.value)});

function appendMsg(text) {
    $("#chatLogs").append("<div>" + text + "</div>");
}

// 人数表示更新
socket.on('update_number_of_player', function(data){updateNumOfPepole(data.num)});

function updateNumOfPepole(num) {
    let message = '現在のプレイヤー人数：' + num + '人'
    document.getElementById('numOfPeople').innerHTML = message;
}

/****************************
 *    各ステージの処理一覧
 ****************************/


// 接続完了('connect')時(最初の接続完了時に'connect'がサーバーからemitされる)
socket.on('connect', () => Init.do(socket));
// サーバーから'cannot_play'がemitされた時
socket.on('cannot_play', () => CannotPlay.do(context, canvas));
// サーバーから'start'がemitされた時(startステージ移行)
socket.on('start', Start.do);
// サーバーから'master_hand_selection'がemitされた時(master_hand_selectionステージ移行)
socket.on('master_hand_selection', (data) => MasterHandSelection.do(data, socket, context));


/****************************
 *  イベントハンドラの登録一覧
 ****************************/

// ゲーム画面クリア
function clearDisplay() {
    // 指定範囲をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 枠線の太さ
    context.lineWidth = 10;
    // 現在のパスをリセット
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();
}

// チャットフォームにsubmitされた時の動作
$("#chatForm").submit((e) => {
    var message = $("#msgForm").val();
    $("#msgForm").val('');
    socket.emit("chat_send_from_client", {value : message});
    e.preventDefault(); // フォームによる/?への接続を止める
});

// エントリーフォームにsubmitされたときの動作
$("#entryForm").submit((event) => Init.entry(event, socket, context, canvas));

// スタートボタンを押した時の動作
startButton.onclick = function() {Start.push(socket,context, canvas)};