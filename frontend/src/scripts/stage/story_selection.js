// master_hand_selectionステージ

import {Utils} from './utils.js'
import React, { useEffect, useState } from 'react';

// export class StorySelection {
//     static do(data, index, socket) {
//         let message;
//         message = "あなたは親です。カードの「タイトル」を入力して下さい";
//         let selected_card = document.getElementById('selected_hand_card');
//         selected_card.setAttribute("src","../images/" + data.player.hand._array[index].filename + ".jpg");
//         document.getElementById("selected_hand_card_form").style.display = 'inline';
//         document.getElementById("hand").style.display ="none";
//         document.getElementById('masterForm').style.display = 'block';
//         document.getElementById('progress').innerHTML = message;
//     }

//     static forward(message){
//         let theme = "あなたが選んだお題:" + message;
//         document.getElementById('theme').innerHTML = theme;
//         document.getElementById('progress').innerHTML = "あなたは親です。子の選択を待ちましょう。";
//         document.getElementById('masterForm').style.display = 'none';
//     }
// }

export default function StorySelection(props) {

    useEffect(() => {
        console.log("aaa");
    }, []);

    const doit = (data, index, socket) => {
        console.log("doit");
    }

    return (
        <div>
            <div id="theme"></div>
            <form className="form-inline" id="selected_hand_card_form" style={{display: "none"}}>
                あなたが選んだカード:
                {/* <img id="selected_hand_card" width="200" height="200"/> */}
            </form> 
            <form className="form-inline" id="masterForm" style={{display: "none"}}>
                <label htmlFor="claim">お題を入力してね：</label>
                <input type="text" className="form-control mb-2 mr-sm-2" id="masterClaim" placeholder="お題"/>
                <button type="submit" className="btn btn-primary mb-2">送信</button>
            </form>
        </div>
    );
}