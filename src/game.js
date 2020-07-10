'use strict';
// クライアント側

// Socket.IOを利用してサーバに接続
const socket = io();
const canvas = document.getElementById('canvas-2d');
const context = canvas.getContext('2d');
const playerImage = $('#playerImage')[0];
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

// サーバーから'server_to_client'がemitされた時の動作(チャット用)
socket.on('server_to_client', function(data){appendMsg(data.value)});

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
// socket.on('entry_done', );
// 'entry_done'がemitされた時の動作
socket.on('waiting', waiting)



// init画面
function init(){
    socket.emit('init');
    console.log('[debug] init状態');
}

// エントリーフォームにsubmitされたときの動作
$("#entryForm").submit(function(e){
    var username = $("#userName").val();
    // $("#entryForm").style.display = none;
    socket.emit('entry', {username : username});
    e.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
});

// cannot_play画面
function cannotPlay() {
    clearDisplay();
    context.font = '20px Bold Arial';
    // let id = player.id.toString()
    context.fillText('現在プレイ中です もう少しお待ちください', canvas.width / 2, canvas.height / 2);
}

// waiting画面
function waiting() {
    // socket.emit('waiting');
    document.getElementById("entryForm").style.display = 'none';
    clearDisplay();
    startButton.style.display = 'block';
    console.log('[debug] waiting状態');
}

// スタートボタンを押した時の動作
startButton.onclick = function() {
    startButton.style.display = none;
    socket.emit('master_hand_selection');
}

function masterHandSelection() {

}

// ゲーム画面クリア
function clearDisplay() {
    // 指定範囲をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 枠線の太さ
    context.lineWidth = 10;
    // ???
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();
}

// チャットフォームにsubmitされた時の動作
$("#chatForm").submit(function(e){
    var message = $("#msgForm").val();
    $("#msgForm").val('');
    socket.emit("client_to_server", {value : message});
    e.preventDefault(); // フォームによる/?への接続を止める
});