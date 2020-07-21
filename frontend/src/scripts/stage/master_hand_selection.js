// master_hand_selectionステージ

import {Utils} from './utils.js'
import StorySelection from './story_selection.js';
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
    const [showstory,setShowStory] = useState(false);
    const [masterIndex, setMasterIndex] = useState(null);
    

    const { register, handleSubmit } = useForm();

    useEffect(() => {
        props.socket.on('hand_selection' ,(data) => master_hand_selection(data));
        props.socket.on('others_hand_selection',(data) => others_hand_selection(data));
    }, []);

    const master_hand_selection = (data) => {
        setShowHand(true);
        console.log('master_hand_selection');
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
                document.getElementById("button"+index).onclick = () => master_select(props.socket,data,index);
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
    };

    const master_select = (socket,data,index) => {
        console.log('index'+index);
        setMasterIndex(index);
        story_selection(data,index,socket);
        console.log('masterindex '+masterIndex);
    }

    const story_selection = (data,index,socket) => {
        let message;
        message = "あなたは親です。カードの「タイトル」を入力して下さい";
        let selected_card = document.getElementById('selected_hand_card');
        selected_card.setAttribute("src","../images/" + data.player.hand._array[index].filename + ".jpg");
        document.getElementById("selected_hand_card_form").setAttribute('style','display:inline');
        document.getElementById("hand").setAttribute('style','display:none');
        //document.getElementById('masterForm').setAttribute('style','display:block');
        setShowStory(true);
        //document.getElementById('progress').innerHTML = message;
    }

    const onSubmit = (data, event) => {
        // サーバーに'entry'を送信
        setShowStory(false);
        let theme = "お題:" + data.story;
        document.getElementById('theme').innerHTML = theme;

        props.socket.emit('story_selection', {message : data.story, masterIndex : masterIndex});
        console.log('onsubmit'+masterIndex);
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    }

    const others_hand_selection = (data) => {
        let theme = "お題:" + data.game.masterClaim;
        document.getElementById('theme').innerHTML = theme;
        let message;
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
            document.getElementById("button"+index).onclick = () => others_select(props.socket,data,index);
        });
        //document.getElementById('progress').innerHTML = message;
    }

    const others_select = (socket,data,index) => {
        let message = "他のユーザーのカード選択を待っています"
        //document.getElementById('progress').innerHTML = message;
        setShowHand(false);

        let selected_card = document.getElementById('selected_hand_card');
        selected_card.setAttribute("src","../images/" + data.player.hand._array[index].filename + ".jpg");
        document.getElementById("selected_hand_card_form").setAttribute('style','display:inline');
        socket.emit('others_hand_selection', {index : index});
    }



    
    return (
        <div>
            <div id="progress"></div>
            <p id="hand" style={ {display: showhand ? 'inline' : 'none'} }></p>

            <div id="theme"></div>
            <form className="form-inline" id="selected_hand_card_form" style={{display: "none"}}>
                あなたが選んだカード:
                <img id="selected_hand_card" width="200" height="200"/> 
            </form> 

            <form className="form-inline" id="masterForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: showstory ? 'inline' : 'none'} }>
                <label htmlFor="claim">お題を入力してね：</label>
                <input type="text" className="form-control mb-2 mr-sm-2" id="masterClaim" name="story" ref={ register } placeholder="お題"/>
                <button type="submit" className="btn btn-primary mb-2">送信</button>
            </form>
        </div>
    );
}