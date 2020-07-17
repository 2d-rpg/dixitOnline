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
}