
import {Utils} from './utils.js'
const startButton = document.getElementById('startButton');

export class Start {

    static do() {
        Utils.clearDisplay();
        startButton.style.display = 'block';
        console.log('[debug] スタート待機状態');
    }

    static push(socket, context, canvas) {
        startButton.style.display = 'none';

        //とりあえずcanvas非表示設定にしてあります
        // Utils.clearDisplay();
        // const fontSize = 20;
        // context.font = fontSize + 'px Bold Arial';
        // const message = '他の参加者がスタートするのを待っています...';
        // // メッセージをcanvas中央に配置
        // context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);

        const message = '他の参加者がスタートするのを待っています...';
        document.getElementById('progress').innerHTML = message;
        
        socket.emit('start');
    }
}