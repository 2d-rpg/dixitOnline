// master_hand_selectionステージ

import {Utils} from './utils.js'

export class MasterHandSelection {
    static do(data, context) {
        Utils.clearDisplay();
        // TODO: srcを変更しているのに，drawImageでの表示が変更されない
        // TODO: 応急処置としてhtmlにサーバーにある画像を追加し，そこから持ってくることにしているがダサい
        const y = 600;
        console.log(player.isMaster);
        data.player.hand._array.forEach((card, index) => {
            var x = 400.0 / 3.0 + index * (100 + 400.0 / (3.0 * 5.0));
            var image = document.getElementById(card.filename);
            context.drawImage(image, 0, 0, image.width, image.height, x, y, 100, 150);
            console.log(card.filename);
            var img = document.createElement("img");
	        img.setAttribute("src", "../images/" + card.filename + ".jpg");
            img.setAttribute("width",100);
            img.setAttribute("height",100);
            // document.getElementById("pic").appendChild(img);
            var btn = document.createElement("button");
            btn.setAttribute("id","button"+index);
            btn.setAttribute("type","button");
            btn.appendChild(img)
            document.getElementById("pic").appendChild(btn);
            document.getElementById("button"+index).onclick = function(){MasterHandSelection.select(index)};
        });
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

    static select(index) {
        alert("push button" + index);
    }
}