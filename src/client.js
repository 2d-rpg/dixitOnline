'use strict';
// クライアント側

// Socket.IOを利用してサーバに接続
const socket = io();
const canvas = document.getElementById('canvas-2d');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const playerImage = document.getElementById('playerImage');

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
socket.on('connect', init);
// サーバーから'cannot_play'がemitされた時の動作
socket.on('cannot_play', cannotPlay);
// サーバーから'waiting'がemitされた時の動作
socket.on('waiting', waiting)
// サーバーから'master_hand_selection'がemitされた時の動作
socket.on('master_hand_selection', function(player){masterHandSelection(player);});

socket.on('master_hand_selection',masterHandSelection)



// init画面
function init(){
    socket.emit('init');
    console.log('[debug] init状態');
}

// エントリーフォームにsubmitされたときの動作
$("#entryForm").submit(function(e){
    var username = $("#userName").val();
    // 名前入力フォーム非表示
    document.getElementById("entryForm").style.display = 'none';
    clearDisplay();
    const fontSize = 20;
    context.font = fontSize + 'px Bold Arial';
    const message = '参加者が集まるまでお待ちください';
    // メッセージをcanvas中央に配置
    context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);
    socket.emit('entry', {username : username});
    e.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
});

// cannot_play画面
function cannotPlay() {
    // 名前入力フォーム表示
    document.getElementById("entryForm").style.display = 'block';
    clearDisplay();
    const fontSize = 20;
    context.font = fontSize + 'px Bold Arial';
    const message = '現在プレイ中です もう少しお待ちください';
    // メッセージをcanvas中央に配置
    context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);
}

// waiting画面
function waiting() {
    clearDisplay();
    startButton.style.display = 'block';
    console.log('[debug] waiting状態');
}

// スタートボタンを押した時の動作
startButton.onclick = function() {
    startButton.style.display = 'none';
    clearDisplay();
    const fontSize = 20;
    context.font = fontSize + 'px Bold Arial';
    const message = '他の参加者がスタートするのを待っています...';
    // メッセージをcanvas中央に配置
    context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);
    socket.emit('entry_done');
}

// master_hand_selection画面
function masterHandSelection(player) {
    clearDisplay();
    // TODO: srcを変更しているのに，drawImageでの表示が変更されない
    player.hand._array.forEach((card, index) => {
        var x = 400.0 / 3.0 + index * (100 + 400.0 / (3.0 * 5.0));
        var y = 600;
        playerImage.src = card.filename;
        console.log(playerImage.width);
        context.drawImage(playerImage, 0, 0, playerImage.width, playerImage.height, x, y, 100, 100);
    });
    console.log(playerImage.src);
}

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
$("#chatForm").submit(function(e){
    var message = $("#msgForm").val();
    $("#msgForm").val('');
    socket.emit("chat_send_from_client", {value : message});
    e.preventDefault(); // フォームによる/?への接続を止める
});