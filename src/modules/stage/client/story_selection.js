// master_hand_selectionステージ

import {Utils} from './utils.js'

export class StorySelection {
    static do(data, socket) {
        let message;
        if(data.player.isMaster){ //語り部の場合
            message = "あなたは親です。カードの「タイトル」を入力して下さい";
            document.getElementById("hand").remove();
            let selected_card = document.getElementById('master_selected_card');
            //本当はこうやりたかった
            //selected_card.setAttribute("src","../images/" + data.player.selectedCard().filename + ".jpg");
            selected_card.setAttribute("src","../images/" + data.player.hand._array[data.player.hand.selectedIndex["index"]].filename + ".jpg");
            selected_card.style.display = 'inline';
            //document.getElementById("hand").style.display ="none";
            document.getElementById('masterForm').style.display = 'block';
        }else{ //その他の場合
            message = "あなたは子です。待機中.........."
        }
        document.getElementById('progress').innerHTML = message;
    }
}