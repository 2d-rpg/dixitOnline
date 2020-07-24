// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// export class MasterHandSelection {
//     static do(data, socket, masterIndex) {
//         let message;
//         if(data.player.isMaster){ //語り部の場合
//             message = 'あなたは親です。カードを選択してください';
//             data.player.hand._array.forEach((card, index) => {
//                 var img = document.createElement("img");
//                 img.setAttribute("src", "../images/" + card.filename + ".jpg");
//                 img.setAttribute("width",100);
//                 img.setAttribute("height",100);
//                 var btn = document.createElement("button");
//                 btn.setAttribute("id","button"+index);
//                 btn.setAttribute("type","button");
//                 btn.appendChild(img)
//                 document.getElementById("hand").appendChild(btn);
//                 document.getElementById("button"+index).onclick = function(){MasterHandSelection.select(socket,data,index,masterIndex)};
//             });
//         }else{ //その他の場合
//             message = 'あなたは子です。待機中...';
//             data.player.hand._array.forEach((card, index) => {
//                 var img = document.createElement("img");
//                 img.setAttribute("src", "../images/" + card.filename + ".jpg");
//                 img.setAttribute("width",100);
//                 img.setAttribute("height",100);
//                 document.getElementById("hand").appendChild(img);
//             });
//         }
//         document.getElementById('progress').innerHTML = message;


//         // const y = 600;    
//         // // プレイヤー名/スコアの表示
//         // // 自分
//         // const fontSize = 20;
//         // context.font = fontSize + 'px Bold Arial';
//         // context.fillText(data.player.name, 20, y);
//         // context.fillText('スコア: ' + data.player.score, 30, y + 40);
//         // // 他の人
//         // console.log(data.others);
//         // data.others.forEach((player, index) => {
//         //     console.log(player);
//         //     context.fillText(player.name, index * 400 + 200, 200);
//         //     context.fillText('スコア: ' + player.score, index * 400 + 200, 200 + 40);
//         // });
//     }

//     static select(socket,data,index,masterIndex) {
//         masterIndex = index;
//         StorySelection.do(data, index, socket);
//     }
// }

export default function HandSelection(props) {
    const [showhand,setShowHand] = useState(false);
    const [showstoryform,setShowStoryForm] = useState(false);
    const [masterIndex, setMasterIndex] = useState(null);
    const [selectedcard, setSelectedCard] = useState(null);
    const [story, setStory] = useState('');
    const [src, setSrc] = useState(null);
    

    const { register, handleSubmit } = useForm();

    useEffect(() => {
        props.socket.on('hand_selection' ,(data) => hand_selection(data));
        props.socket.on('others_hand_selection',(data) => others_hand_selection(data));
        props.socket.on('result',(data) => reset_selected());
    });

    const hand_selection = (data) => {
        setShowHand(true);
        // リセット
        document.getElementById("hand").innerHTML = "";
        setStory('');
        setSelectedCard(false);
        if(data.player.isMaster){ //語り部の場合
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
                document.getElementById("button"+index).onclick = () => master_select(props.socket,data,index);
            });
        }else{ //その他の場合
            data.player.hand._array.forEach((card, index) => {
                var img = document.createElement("img");
                img.setAttribute("src", "../images/" + card.filename + ".jpg");
                img.setAttribute("width",100);
                img.setAttribute("height",100);
                document.getElementById("hand").appendChild(img);
            });
        }
    };

    const master_select = (socket,data,index) => {
        setMasterIndex(index);
        story_selection(data,index,socket);
    }

    const story_selection = (data,index,socket) => {
        setSrc("../images/" + data.player.hand._array[index].filename + ".jpg");
        setSelectedCard(true);
        setShowHand(false);
        setShowStoryForm(true);
    }

    const onSubmit = (data, event) => {
        setShowStoryForm(false);
        setStory("お題:" + data.story);
        // サーバーに'story_selection'を送信
        props.socket.emit('story_selection', {message : data.story, masterIndex : masterIndex});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    }

    const others_hand_selection = (data) => {
        setStory("お題:" + data.game.masterClaim);
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
            document.getElementById("button"+index).onclick = () => others_select(props.socket,data,index);
        });
    }

    const others_select = (socket,data,index) => {
        setShowHand(false);
        setSrc("../images/" + data.player.hand._array[index].filename + ".jpg");
        setSelectedCard(true);
        socket.emit('others_hand_selection', {index : index});
    }
    
    const reset_selected = () => {
        setShowStoryForm(false);
        setSelectedCard(false);
        setStory('');
    }



    
    return (
        <div>
            <p id="hand" style={ {display: showhand ? 'inline' : 'none'} }></p>

            <div id="story">{ story }</div>
            <form className="form-inline" id="selected_hand_card_form" style={{display: selectedcard ? 'inline' : 'none'}}>
                あなたが選んだカード:
                <img id="selected_hand_card" width="200" height="200" src={ src } alt="あなたが選んだカード"/> 
            </form> 

            <form className="form-inline" id="masterForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: showstoryform ? 'inline' : 'none'} }>
                <label htmlFor="claim">お題を入力してね：</label>
                <input type="text" className="form-control mb-2 mr-sm-2" id="masterClaim" name="story" ref={ register } placeholder="お題"/>
                <button type="submit" className="btn btn-primary mb-2">送信</button>
            </form>
        </div>
    );
}