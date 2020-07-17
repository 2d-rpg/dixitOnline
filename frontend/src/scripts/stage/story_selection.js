// master_hand_selectionステージ

import {Utils} from './utils.js'

export class StorySelection {
    static do(data, index, socket) {
        let message;
        message = "あなたは親です。カードの「タイトル」を入力して下さい";
        let selected_card = document.getElementById('selected_hand_card');
        selected_card.setAttribute("src","../images/" + data.player.hand._array[index].filename + ".jpg");
        document.getElementById("selected_hand_card_form").style.display = 'inline';
        document.getElementById("hand").style.display ="none";
        document.getElementById('masterForm').style.display = 'block';
        document.getElementById('progress').innerHTML = message;
    }

    static forward(message){
        let theme = "あなたが選んだお題:" + message;
        document.getElementById('theme').innerHTML = theme;
        document.getElementById('progress').innerHTML = "あなたは親です。子の選択を待ちましょう。";
        document.getElementById('masterForm').style.display = 'none';
    }
}