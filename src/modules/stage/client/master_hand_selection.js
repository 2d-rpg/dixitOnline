// master_hand_selectionステージ

import {Utils} from './utils.js'

export class MasterHandSelection {
    static do(data, socket) {
        let message;
        if(data.player.isMaster){ //語り部の場合
            message = 'あなたは親です。カードを選択してください';
            data.player.hand._array.forEach((card, index) => {
                var img = document.createElement("img");
                img.setAttribute("src", "../images/" + card.filename + ".jpg");
                img.setAttribute("width",100);
                img.setAttribute("height",100);
                var btn = document.createElement("button");
                btn.setAttribute("id","button"+index);
                btn.setAttribute("type","button");
                btn.appendChild(img)
                document.getElementById("hand").appendChild(btn);
                document.getElementById("button"+index).onclick = function(){MasterHandSelection.select(socket,index)};
            });
        }else{ //その他の場合
            message = 'あなたは子です。待機中...';
            data.player.hand._array.forEach((card, index) => {
                var img = document.createElement("img");
                img.setAttribute("src", "../images/" + card.filename + ".jpg");
                img.setAttribute("width",100);
                img.setAttribute("height",100);
                document.getElementById("hand").appendChild(img);
            });
        }
        document.getElementById('progress').innerHTML = message;


        const y = 600;    
        // プレイヤー名/スコアの表示
        // 自分
        const fontSize = 20;
        context.font = fontSize + 'px Bold Arial';
        context.fillText(data.player.name, 20, y);
        context.fillText('スコア: ' + data.player.score, 30, y + 40);
        // 他の人
        console.log(data.others);
        data.others.forEach((player, index) => {
            console.log(player);
            context.fillText(player.name, index * 400 + 200, 200);
            context.fillText('スコア: ' + player.score, index * 400 + 200, 200 + 40);
        });
    }

    static select(socket,index) {
        socket.emit('master_hand_selection', {index : index});
    }
}