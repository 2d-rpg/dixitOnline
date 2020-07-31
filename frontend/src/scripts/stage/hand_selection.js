// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function HandSelection(props) {
    /** 手札を表示するか否か */
    const [showhand,setShowHand] = useState(false);
    /** お題フォームを表示するか否か */
    const [showstoryform,setShowStoryForm] = useState(false);
    /** 語り部が選んだカードの手札上のインデックス */
    const [masterIndex, setMasterIndex] = useState(null);
    /** 手札から選ばれたカードを表示するか否か */
    const [selectedcard, setSelectedCard] = useState(null);
    /** お題の内容 */
    const [story, setStory] = useState('');
    /** 手札から選ばれたカードのソース */
    const [src, setSrc] = useState(null);
    /** 手札の内容 */
    const [hand_buttons, setHandButtons] = useState(null);
    /** お題フォーム */
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        /** 手札の表示 */
        const hand_selection = (data) => {
            setShowHand(true);
            // リセット
            setStory('');
            setSelectedCard(false);
            if(data.player.isMaster){ //語り部の場合
                setHandButtons(
                    data.player.hand._array.map((card, index) => {
                        var id = 'hand' + index;
                        var hand_src = "../images/" + card.filename + ".jpg";
                        return (
                        <button id={ id } type='button' onClick={ () => master_select(data, index)}>
                            <img width='100' height='100' src={ hand_src } alt={ card.filename }></img>
                        </button>);
                    })
                );
            }else{ // 語り部以外のプレイヤーの場合
                setHandButtons(
                    data.player.hand._array.map((card) => {
                        var hand_src = "../images/" + card.filename + ".jpg";
                        return (<img width='100' height='100' src={ hand_src } alt={ card.filename }></img>);
                    })
                );
            }
            props.setMessage('aaa');
        };
        /** 語り部が手札からカードを選択したときの動作 */
        const master_select = (data, index) => {
            setMasterIndex(index);
            story_selection(data, index);
        };
        /** 語り部が手札から選んだカードの表示と手札の非表示及びお題フォームの表示 */
        const story_selection = (data, index) => {
            setSrc("../images/" + data.player.hand._array[index].filename + ".jpg");
            setSelectedCard(true);
            //setShowHand(false);
            setShowStoryForm(true);
        };
        /** 語り部以外のプレイヤーの手札の表示 */
        const others_hand_selection = (data) => {
            if(data.player.isMaster){
                props.socket.emit('wait');
            }else{
                console.log("others_hand_selectionにきたよ");
                console.log(data.player.hand);
                setShowHand(true);
                setStory("お題:" + data.game.masterClaim);
                setHandButtons(
                data.player.hand._array.map((card, index) => {
                    var id = 'hand' + index;
                    var hand_src = "../images/" + card.filename + ".jpg";
                    return (
                    <button id={ id } type='button' onClick={ () => others_select(props.socket,data,index)}>
                        <img width='100' height='100' src={ hand_src } alt={ card.filename }></img>
                    </button>);
                })
            );
            }
        };
        /**語り部以外のプレイヤーが手札からカードを選んだときの動作 */
        const others_select = (socket, data, index) => {
            setShowHand(false);
            setSrc("../images/" + data.player.hand._array[index].filename + ".jpg");
            setSelectedCard(true);
            socket.emit('others_hand_selection', {index : index});
        };
        /** 手札の表示とお題のリセット */
        const reset_selected = () => {
            setShowStoryForm(false);
            setSelectedCard(false);
            setStory('');
        };
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('hand_selection' ,(data) => hand_selection(data));
        props.socket.on('others_hand_selection',(data) => others_hand_selection(data));
        props.socket.on('result',(data) => reset_selected());
    }, [ props.socket ]);

    /** お題のフォーム送信ボタンを押したときの動作 */
    const onSubmit = (data, event) => {
        setShowHand(false);
        setShowStoryForm(false);
        setStory("お題:" + data.story);
        // サーバーに'story_selection'を送信
        props.socket.emit('story_selection', {message : data.story, masterIndex : masterIndex});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    };

    return (
        <div>
            <div id="hand" style={ {display: showhand ? 'inline' : 'none'} }>{ hand_buttons }</div>
            <div id="story">{ story }</div>
            <form className="form-inline" id="selected_hand_card_form" style={{display: selectedcard ? 'inline' : 'none'}}>
                あなたがフィールドから選んだカード:
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