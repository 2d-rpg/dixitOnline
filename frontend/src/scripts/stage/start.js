
import {Utils} from './utils.js'
import React from 'react';
// const startButton = document.getElementById('startButton');

// export class Start {

//     static do() {
//         startButton.style.display = 'block';
//         console.log('[debug] スタート待機状態');
//         const message = '参加登録しましょう';
//         document.getElementById('progress').innerHTML = message;
//     }

//     static push(socket, context, canvas) {
//         startButton.style.display = 'none';

//         //とりあえずcanvas非表示設定にしてあります
//         // Utils.clearDisplay();
//         // const fontSize = 20;
//         // context.font = fontSize + 'px Bold Arial';
//         // const message = '他の参加者がスタートするのを待っています...';
//         // // メッセージをcanvas中央に配置
//         // context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);

//         const message = '他の参加者がスタートするのを待っています...';
//         document.getElementById('progress').innerHTML = message;
        
//         socket.emit('start');
//     }
// }

export default function Start() {

    const notDisplay = {display: "none"};

    return (
        <button id="startButton" type="button" className="btn btn-warning" style={ notDisplay }>スタート</button>
    );
}