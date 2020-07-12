'use strict';
// クライアント側
// import modules
import {Init} from './modules/stage/client/init.js'
import {Waiting} from './modules/stage/client/waiting.js'
import {Utils} from './modules/stage/client/utils.js'
// const init = require('./modules/stage/client/init');
// Socket.IOを利用してサーバに接続
const socket = io();
const canvas = document.getElementById('canvas-2d');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

// サーバーから'state'がemitされたときの動作
socket.on('state', (players) => {
    clearDisplay();
    // サーバーから送られてきたplayersをそれぞれcanvasに描画
    Object.values(players).forEach((player) => {
        // context.drawImage(playerImage, player.x, player.y);
        // context.font = '20px Bold Arial';
        // let id = player.id.toString()
        // context.fillText('Player' + id, player.x, player.y - 20);
    });
});

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

// 接続完了('connect')時の動作(最初の接続完了時に'connect'がサーバーからemitされる)
socket.on('connect', function(socket){Init.do(socket);});
// サーバーから'cannot_play'がemitされた時の動作
socket.on('cannot_play', cannotPlay);
// サーバーから'waiting'がemitされた時の動作
socket.on('waiting', Waiting.do);
// サーバーから'master_hand_selection'がemitされた時の動作
socket.on('master_hand_selection', function(data){masterHandSelection(data);});

socket.on('master_hand_selection',masterHandSelection)


// エントリーフォームにsubmitされたときの動作
$("#entryForm").submit(function(e){
    var username = $("#userName").val();
    // 名前入力フォーム非表示
    document.getElementById("entryForm").style.display = 'none';
    Utils.clearDisplay();
    const fontSize = 20;
    context.font = fontSize + 'px Bold Arial';
    const message = '参加者が集まるまでしばらくお待ちください';
    // メッセージをcanvas中央に配置
    context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);
    socket.emit('entry', {username : username});
    e.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
});

// cannot_play画面
function cannotPlay() {
    // 名前入力フォーム表示
    document.getElementById("entryForm").style.display = 'block';
    Utils.clearDisplay();
    const fontSize = 20;
    context.font = fontSize + 'px Bold Arial';
    const message = '現在プレイ中です しばらくお待ちください';
    // メッセージをcanvas中央に配置
    context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);
}

// スタートボタンを押した時の動作
startButton.onclick = function() {
    startButton.style.display = 'none';
    Utils.clearDisplay();
    const fontSize = 20;
    context.font = fontSize + 'px Bold Arial';
    const message = '他の参加者がスタートするのを待っています...';
    // メッセージをcanvas中央に配置
    context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);
    socket.emit('entry_done');
}

// master_hand_selection画面
function masterHandSelection(data) {
    Utils.clearDisplay();
    // TODO: srcを変更しているのに，drawImageでの表示が変更されない
    // TODO: 応急処置としてhtmlにサーバーにある画像を追加し，そこから持ってくることにしているがダサい
    const y = 600;
    data.player.hand._array.forEach((card, index) => {
        var x = 400.0 / 3.0 + index * (100 + 400.0 / (3.0 * 5.0));
        var image = document.getElementById(card.filename);
        context.drawImage(image, 0, 0, image.width, image.height, x, y, 100, 150);
    });
    // プレイヤー名/スコアの表示
    // 自分
    const fontSize = 20;
    context.font = fontSize + 'px Bold Arial';
    context.fillText(data.player.name, 20, y);
    context.fillText('スコア: ' + data.player.score, 30, y + 40);
    // 他の人
    console.log(data.others);
    data.others.forEach((player, index) => {
        console.log(player);
        context.fillText(player.name, index * 400 + 200, 200);
        context.fillText('スコア: ' + player.score, index * 400 + 200, 200 + 40);
    });
}

// チャットフォームにsubmitされた時の動作
$("#chatForm").submit(function(e){
    var message = $("#msgForm").val();
    $("#msgForm").val('');
    socket.emit("chat_send_from_client", {value : message});
    e.preventDefault(); // フォームによる/?への接続を止める
});