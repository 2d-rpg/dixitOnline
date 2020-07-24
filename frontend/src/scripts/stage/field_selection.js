// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export function FieldSelection(props) {

    // const { register, handleSubmit } = useForm();
    const [showfield,setShowField] = useState(false);

    // const onSubmit = (data, event) => {
    //     setShow(false);
    //     //サーバーの'field_selection'
    //     props.socket.emit('field_selection', {answer : data.answer});
    //     event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    // }

    useEffect(() => {
        props.socket.on('field_selection' ,(data) => field_selection(data));
    }, []);

    const field_selection = (data) => {
        setShowField(true);
        console.log('field_selection');
        let message;
        // fieldの表示

        if(!data.player.isMaster){ //子の場合
            message = 'あなたは子です。カードを選択して下さい';
            data.game.field.cards.forEach((card, index) => {
                var img = document.createElement("img");
                img.setAttribute("src", "../images/" + card.filename + ".jpg");
                img.setAttribute("width",100);
                img.setAttribute("height",100);
                var btn = document.createElement("button");
                btn.setAttribute("id","fieldbutton"+index);
                btn.setAttribute("type","button");
                btn.appendChild(img)
                document.getElementById("field").appendChild(btn);
                document.getElementById("fieldbutton"+index).onclick = () => others_field_select(props.socket,data,index);
            });
        }else{ //親の場合
            message = 'あなたは親です。待機中...';
            data.game.field.cards.forEach((card) => {
                var img = document.createElement("img");
                img.setAttribute("src", "../images/" + card.filename + ".jpg");
                img.setAttribute("width",100);
                img.setAttribute("height",100);
                document.getElementById("field").appendChild(img);
                props.socket.emit('wait');
            });
        }
    };

    const others_field_select = (socket,data,index) => {
        // let message;
        // message = "あなたは親です。カードの「タイトル」を入力して下さい";
        setShowField(false);
        let selected_card = document.getElementById('selected_field_card');
        selected_card.setAttribute("src","../images/" + data.game.field.cards[index].filename + ".jpg");
        document.getElementById("selected_field_card_form").setAttribute('style','display:inline');
        // document.getElementById("field").setAttribute('style','display:none');
        //document.getElementById('masterForm').setAttribute('style','display:block');
        //document.getElementById('progress').innerHTML = message;
        socket.emit('field_selection', {index : index});
    }

    //親の場合
    // return (
    //     <div>
    //         // fieldのカードを並べる
    //         //　他のユーザー待ち
    //     </div>
    // );

    // 子の場合
    // MAX = 


    return (
        <div>
            <p id="field" style={ {display: showfield ? 'inline' : 'none'} }></p>
            <form className="form-inline" id="selected_field_card_form" style={{display: "none"}}>
                あなたが選んだカード:
                <img id="selected_field_card" width="200" height="200"/> 
            </form> 

            {/* <form className="form-inline" id="answerForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: show ? 'block' : 'none' } }>
                <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                <input type="number" className="form-control mb-2 mr-sm-2" name="answer" ref={ register } placeholder="親が出したと思うカードの番号を入力してください" />
                <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
            </form> */}
            {/* //　送信後は待ち */}
        </div>
    );
}