// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';

import '../../css/hand_selection.css';
import StoryModal from './modal/story_modal';

export default function HandSelection(props) {
    /** 手札を表示するか否か */
    const [showhand,setShowHand] = useState(false);
    /** 語り部が選んだカードの手札上のインデックス */
    const [masterIndex, setMasterIndex] = useState(null);
    /** お題の内容 */
    const [story, setStory] = useState('');
    /** 手札から選ばれたカードのソース */
    const [src, setSrc] = useState(null);
    /** 手札の内容 */
    const [hand_buttons, setHandButtons] = useState(null);

    useEffect(() => {
        /** 手札の表示 */
        const hand_selection = (data) => {
            setShowHand(true);
            // リセット
            setStory('');
            setHandButtons(
                data.player.hand._array.map((card, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + card.filename;
                    const handButton = data.player.isMaster? (
                        <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => master_select(data, index)} data-toggle="modal" data-target="#exampleModalCenter">
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p> 
                    ) : (
                        <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => master_select(data, index)}>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (
                    <div className='eachHandContainer' display='inline-flex'>
                        { handButton }
                    </div>);
                })
            );
            if(data.player.isMaster){ //語り部の場合
                props.setMessage('あなたは親です(ﾟ∀ﾟ)カードを選択してください(=^▽^)σ');
            }else{ // 語り部以外のプレイヤーの場合
                props.setMessage('あなたは子です(ﾟ∀ﾟ)待機中( ´Д`)y━･~~');
            }
        };
        /** 語り部が手札からカードを選択したときの動作 */
        const master_select = (data, index) => {
            if(data.player.isMaster){
                setMasterIndex(index);
                story_selection(data, index);
            }else{
                //TODO:子の表示
            }
        };
        /** 語り部が手札から選んだカードの表示と手札の非表示及びお題フォームの表示 */
        const story_selection = (data, index) => {
            props.setMessage('あなたは親です(ﾟ∀ﾟ)カードのお題を入力してください⊂((・x・))⊃');
            setSrc("../images/default/" + data.player.hand._array[index].filename);
        };
        /** 語り部以外のプレイヤーの手札の表示 */
        const others_hand_selection = (data) => {
            if(data.player.isMaster){
                props.setMessage('あなたは親です(ﾟ∀ﾟ)待機中( ´Д`)y━･~~');
                props.socket.emit('wait');
            }else{
                props.setMessage('あなたは子です(ﾟ∀ﾟ)お題に沿ったカードを選択してください(=^▽^)σ');
                console.log(data.player.hand);
                setShowHand(true);
                setStory("お題:" + data.game.masterClaim);
                setHandButtons(
                data.player.hand._array.map((card, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + card.filename;
                    return (
                        <div className='eachHandContainer' display='inline-flex'>
                            <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => others_select(props.socket,data, index)}>
                                <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                            </p>
                        </div>);
                })
            );
            }
        };
        /**語り部以外のプレイヤーが手札からカードを選んだときの動作 */
        const others_select = (socket, data, index) => {
            
            props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
            setSrc("../images/default/" + data.player.hand._array[index].filename);
            socket.emit('others_hand_selection', {index : index});
        };
        /** 手札の表示とお題のリセット */
        const reset_story= () => {
            setStory('');
        };
        /** 手札の更新 */
        const update_hand = (player) => {
            setHandButtons(
                player.hand._array.map((card, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + card.filename;
                    return (
                    <div className='eachHandContainer' display='inline-flex'>
                        <p className='eachHandButton' id={ id_btn } type='button'>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ card.filename }></img>
                        </p>
                    </div>);
                })
            );
        };
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('hand_selection' ,(data) => hand_selection(data));
        props.socket.on('others_hand_selection',(data) => others_hand_selection(data));
        props.socket.on('result',(data) => reset_story());
        props.socket.on('update_hand',(data) => update_hand(data.player));
    }, [ props ]);


    return (
        <div className="hand-wrapper">
            <div className="hand-content">
                <div id="hand" style={ {display: showhand ? 'inline-flex' : 'none'} }>{ hand_buttons }</div>
                <StoryModal socket={ props.socket } setStory={ setStory } masterIndex={ masterIndex } src={ src }/>
            </div>
            <div id="story">{ story }</div>
        </div>
    );
}