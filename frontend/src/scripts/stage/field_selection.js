// field_selectionステージ

import React, { useEffect, useState } from 'react';
import '../../css/field_selection.css';

const WIDTH = '100';
const HEIGHT = '200';

export default function FieldSelection(props) {

    /** フィールドを表示するか否か */
    const [showfield,setShowField] = useState(true);
    /** 語り部以外のプレイヤーがフィールド上から選んだカードを表示するか否か */
    const [showselected, setShowSelected] = useState(false);
    /** 語り部以外のプレイヤーがフィールド上から選んだカードのソース */
    const [src, setSrc] = useState(null);
    /** フィールドの表示内容 */
    const [field_buttons, setFieldButtons] = useState(null);

    const [showfieldWrapper, setShowfieldWrapper] = useState(true);


    useEffect(() => {
        /** フィールドの表示 */
        const field_selection = (data) => {
            setShowfieldWrapper(true);
            setFieldButtons(
                data.game.field.cards.map((card, index) => {
                    var id_btn = 'eachFieldButton' + index;
                    var id_img = 'eachFieldImage' + index;
                    var field_src = "../images/default/" + card.filename;
                    return (
                    <div className='eachFieldContainer' display='inline-flex'>
                        <p className='eachFieldButton' id={ id_btn } type='button' onClick={ () => others_field_select(props.socket, data, index)}>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    </div>);
                })
            );
            if(!data.player.isMaster){ // 語り部以外のプレイヤーの場合
                props.setMessage('あなたは子です(ﾟ∀ﾟ)親が出したと思うカードを選択してください(=^▽^)σ');
            } else { // 語り部の場合
                props.setMessage('あなたは親です(ﾟ∀ﾟ)子の選択を待ちましょう( ´Д`)y━･~~');
                props.socket.emit('wait');
            }
        };
        /** 語り部以外のプレイヤーがフィールド上のカードを選んだときの動作 */
        const others_field_select = (socket,data,index) => {
            if (!data.player.isMaster) {
                props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
                // setShowField(false);
                setSrc("../images/default/" + data.game.field.cards[index].filename);
                // setShowSelected(true);
                socket.emit('field_selection', {index : index});
            }
        }
        /** フィールドの表示リセット */
        const field_reset = () => {
            setShowSelected(false);
            setShowField(false);
            setShowfieldWrapper(false);
        }
        /** フィールドの更新 */
        const update_field = (game) => {
            setShowField(true);
            setFieldButtons(
                game.field.cards.map((card, index) => {
                    var id_btn = 'eachFieldButton' + index;
                    var id_img = 'eachFieldImage' + index;
                    var field_src = "../images/back/card_back.png";
                    return (
                    <div className='eachFieldContainer' display='inline-flex'>
                        <p className='eachFieldButton' id={ id_btn } type='button'>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    </div>);
                })
            );
        };
        /** sleepの実装 */
        // const sleep = (waitMsec) => {
        //     var startMsec = new Date();
        //     // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
        //     while (new Date() - startMsec < waitMsec);
        // };
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('field_selection' ,(data) => field_selection(data));
        props.socket.on('hand_selection' ,() => setShowField(false));
        props.socket.on('result' ,() => field_reset());
        props.socket.on('update_field', (data) => update_field(data.game));
    }, [ props ]);

    return (
        <div className='field-wrapper' style={ {display: showfieldWrapper ? 'block' : 'none'} }>
            <div id="field" style={ {display: showfield ? 'inline-flex' : 'none'} }>{ field_buttons }</div>
            <div className="form-inline" id="selected_field_card" style={{display: showselected ? 'inline' : 'none'}}>
                あなたがフィールドから選んだカード:
                <img id="selected_field_card" width={ WIDTH } height={ HEIGHT } src={ src } alt="フィールドから選んだカード"/>
            </div> 
        </div>
    );
}