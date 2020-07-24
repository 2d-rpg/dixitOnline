// field_selectionステージ

import React, { useEffect, useState } from 'react';

export default function FieldSelection(props) {

    const [showfield,setShowField] = useState(false);
    const [showselected, setShowSelected] = useState(false);
    const [src, setSrc] = useState(null);


    useEffect(() => {
        props.socket.on('field_selection' ,(data) => field_selection(data));
        props.socket.on('hand_selection' ,() => field_reset());
        props.socket.on('result' ,() => field_reset());
    });

    const field_selection = (data) => {
        setShowField(true);
        document.getElementById('field').innerHTML = '';
        // fieldの表示
        if(!data.player.isMaster){ //子の場合
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
        setSrc("../images/" + data.game.field.cards[index].filename + ".jpg");
        setShowSelected(true);
        socket.emit('field_selection', {index : index});
    }

    const field_reset = () => {
        setShowSelected(false);
        setShowField(false);
    }

    return (
        <div>
            <p id="field" style={ {display: showfield ? 'inline' : 'none'} }></p>
            <div className="form-inline" id="selected_field_card" style={{display: showselected ? 'inline' : 'none'}}>
                あなたが選んだカード:
                <img id="selected_field_card" width="200" height="200" src={src} alt="フィールドから選んだカード"/>
            </div> 

            {/* <form className="form-inline" id="answerForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: show ? 'block' : 'none' } }>
                <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                <input type="number" className="form-control mb-2 mr-sm-2" name="answer" ref={ register } placeholder="親が出したと思うカードの番号を入力してください" />
                <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
            </form> */}
            {/* //　送信後は待ち */}
        </div>
    );
}