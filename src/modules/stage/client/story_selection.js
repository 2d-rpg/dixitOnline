// master_hand_selectionステージ

import {Utils} from './utils.js'

export class StorySelection {
    static do(data, socket) {
        let message;
        if(data.player.isMaster){ //語り部の場合
            message = "あなたは親です。カードの「タイトル」を入力して下さい";
            let selected_card = document.getElementById('selected_hand_card');
            selected_card.setAttribute("src","../images/" + data.player.hand._array[data.player.hand.selectedIndex].filename + ".jpg");
            document.getElementById("selected_hand_card_form").style.display = 'inline';
            document.getElementById("hand").style.display ="none";
            document.getElementById('masterForm').style.display = 'block';
        }else{ //その他の場合
            message = "あなたは子です。待機中.........."
        }
        document.getElementById('progress').innerHTML = message;
    }
}