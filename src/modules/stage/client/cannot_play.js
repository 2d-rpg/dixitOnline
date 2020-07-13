// cannot_play画面

import {Utils} from './utils.js'

export class CannotPlay {

    static do(context, canvas) {
        // 名前入力フォーム表示
        document.getElementById("entryForm").style.display = 'block';
        Utils.clearDisplay();
        const fontSize = 20;
        context.font = fontSize + 'px Bold Arial';
        const message = '現在プレイ中です しばらくお待ちください';
        // メッセージをcanvas中央に配置
        context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);
    }
}