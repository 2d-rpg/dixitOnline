// master_hand_selectionステージ

import {Utils} from './utils.js'

export class FieldSelection {
    static do(data, socket) {
        //TODO:ここに追加していく
        document.getElementById("selected_hand_card_form").style.display = 'none';

        // fieldに選べれたカードを並べる
        let message;
        if(data.player.isMaster){ //語り部の場合
            message = 'あなたは親です。子の選択を待ちましょう。';

        }else{ //その他の場合
            message = "お題に合ったカードを選ぼう!"
            //カードの選択

            // プレイヤー、カードの組み合わせの情報を送る

        }
        document.getElementById('progress').innerHTML = message;
    }
}