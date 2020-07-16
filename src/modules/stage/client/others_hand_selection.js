// master_hand_selectionステージ

import {Utils} from './utils.js'

export class OthersHandSelection {
    static do(data, socket) {
        let message;
        if(data.player.isMaster){ //語り部の場合
            message = "あなたは親です。子の選択を待ちましょう";
            document.getElementById('masterForm').style.display = 'none';
        }else{ //その他の場合
            message = "あなたは子です。お題に沿ったカードを選択してください。"
            let hand = document.getElementById("hand");
            while(hand.hasChildNodes()){
                hand.removeChild(hand.firstChild);
            }
            data.player.hand._array.forEach((card, index) => {
                var img = document.createElement("img");
                img.setAttribute("src", "../images/" + card.filename + ".jpg");
                img.setAttribute("width",100);
                img.setAttribute("height",100);
                var btn = document.createElement("button");
                btn.setAttribute("id","button"+index);
                btn.setAttribute("type","button");
                btn.appendChild(img);

                hand.appendChild(btn);
                document.getElementById("button"+index).onclick = function(){OthersHandSelection.select(socket,index)};
            });
        }
        document.getElementById('progress').innerHTML = message;
        if(data.player.isMaster){
            //socket.emit('wait', {});
        }
    }

    static select(socket,index) {
        socket.emit('others_hand_selection', {index : index});
    }
}