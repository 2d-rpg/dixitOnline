
import {Utils} from './utils.js'

export class Init {

    static do(socket) {
        socket.emit('init');
        console.log('[debug] init状態');
    }

    /** エントリーフォーム送信時 */
    static entry(event, socket, context, canvas) {
        var username = $("#userName").val();
        // 名前入力フォーム非表示
        document.getElementById("entryForm").style.display = 'none';

        //とりあえずcanvas非表示設定にしてあります
        // Utils.clearDisplay();
        // const fontSize = 20;
        // context.font = fontSize + 'px Bold Arial';
        // const message = '参加者が集まるまでしばらくお待ちください';
        // // メッセージをcanvas中央に配置
        // context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);

        const message = '参加者が集まるまでしばらくお待ちください';
        document.getElementById('progress').innerHTML = message;

        // サーバーに'entry'を送信
        socket.emit('entry', {username : username});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    }
}