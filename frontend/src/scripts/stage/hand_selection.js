// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import Card from '../card';
import '../../css/hand_selection.css';

export default function HandSelection(props) {
    /** 手札を表示するか否か */
    const [showhand, setShowHand] = useState(false);
    /** 手札の内容 */
    const [hand_buttons, setHandButtons] = useState(null);

    useEffect(() => {
        /** 手札の表示 */
        const draw_card = (data) => {
            setShowHand(true);
            setHandButtons(
                data.player.hand._array.slice(0, 5).map((card, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + card.filename;
                    const handButton = data.player.isMaster ? (
                        <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => master_select(data, index)} data-toggle="modal" data-target="#exampleModalCenter">
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p> 
                    ) : (
                        <p className='eachHandButton' id={ id_btn } type='button'>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return(<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );


            setTimeout(() => {
                hand_selection(data);
            }, data.game.discard._array.length === 0 ? 3000 : 1000);
        }

        const hand_selection = (data) => {

            setHandButtons(
                data.player.hand._array.map((card, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + card.filename;
                    const handButton = data.player.isMaster ? (
                        <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => master_select(data, index)} data-toggle="modal" data-target="#exampleModalCenter">
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p> 
                    ) : (
                        <p className='eachHandButton' id={ id_btn } type='button'>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return(<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );

            if(data.player.isMaster){ //語り部の場合
                props.setMessage('あなたは親です(ﾟ∀ﾟ)カードを選択してください(=^▽^)σ');
            } else { // 語り部以外のプレイヤーの場合
                props.setMessage('あなたは子です(ﾟ∀ﾟ)待機中( ´Д`)y━･~~');
            }
        };
        /** 語り部が手札からカードを選択したときの動作 */
        const master_select = (data, index) => {
            if(data.player.isMaster){
                props.setMasterIndex(index);
                story_selection(data, index);
            }else{
                //TODO:子の表示
            }
        };
        /** 語り部が手札から選んだカードの表示と手札の非表示及びお題フォームの表示 */
        const story_selection = (data, index) => {
            props.setMessage('あなたは親です(ﾟ∀ﾟ)カードのお題を入力してください⊂((・x・))⊃');
            const selectedSrc = "../images/default/" + data.player.hand._array[index].filename;
            props.setSrc(
                <p className="selectedButton" id="selected-hand-card-wrapper">
                    <img className="selectedImage" src={ selectedSrc } alt="あなたが選んだカード"/> 
                </p> );
        };
        /** 語り部以外のプレイヤーの手札の表示 */
        const others_hand_selection = (data) => {


            if(data.player.isMaster){
                props.setMessage('あなたは親です(ﾟ∀ﾟ)待機中( ´Д`)y━･~~');
                props.socket.emit('wait');
            } else {
                props.setMessage('あなたは子です(ﾟ∀ﾟ)お題に沿ったカードを選択してください(=^▽^)σ');
                setHandButtons(
                    data.player.hand._array.map((card, index) => {
                        var id_btn = 'eachHandButton' + index;
                        var id_img = 'eachHandImage' + index;
                        var hand_src = "../images/default/" + card.filename;
                        const handButton = (
                            <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => others_select(props.socket ,data, index)}>
                                <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                            </p>
                        );
                        return (<Card button={ handButton } kind={ 'Hand' }/>);
                    })
                );
            }
        };

        /**語り部以外のプレイヤーが手札からカードを選んだときの動作 */
        const others_select = (socket, data, index) => {
            $(".toField").removeClass("toField");
            $("#eachHandButton" + index).addClass("toField");
            var card_x = $("#eachHandButton" + index).offset().left;
            var field_x = ($("#eachHandButton" + 2).offset().left + $("#eachHandButton" + 3).offset().left) / 2;
            var card_y = $("#eachHandButton" + index).offset().top;
            var field_y = $(".eachFieldContainer").offset().top;
            document.getElementsByClassName("toField")[0].animate([
                // keyframes
                { transform: 'translateY(0px)'}, 
                { transform: `translate(${field_x - card_x}px, ${field_y - card_y}px)` , opacity: 0 },
              ], { 
                // timing options
                duration: 800,
            });
            props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
            const selectedSrc = "../images/default/" + data.player.hand._array[index].filename;
            props.setSrc(
                <p className="selected-handcard-wrapper" id="selected-hand-card-wrapper">
                    <img id="selected-hand-card" src={ selectedSrc } alt="あなたが選んだカード"/> 
                </p> );
            setTimeout(
                () => socket.emit('others_hand_selection', {index : index}),
                800,
            );
        };
        /** 手札の更新 */
        const update_hand = (player) => {
            setHandButtons(
                player.hand._array.map((card, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + card.filename;
                    const handButton = (
                        <p className='eachHandButton' id={ id_btn } type='button'>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );
        };
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('hand_selection' ,(data) => draw_card(data));
        props.socket.on('others_hand_selection',(data) => others_hand_selection(data));
        props.socket.on('update_hand',(data) => update_hand(data.player));
        props.socket.on('restart',() => setShowHand(false));
    }, [ props ]);

    return (
        <div className="hand-wrapper" style={ {display: showhand ? 'block' : 'none'} }>
            <div className="hand-content">
                <div id="hand">{ hand_buttons }</div>
            </div>
        </div>
    );
}