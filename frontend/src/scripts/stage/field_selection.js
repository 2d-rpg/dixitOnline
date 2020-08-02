// field_selectionステージ

import React, { useEffect, useState } from 'react';

const WIDTH = '100';
const HEIGHT = '200';

export default function FieldSelection(props) {

    /** フィールドを表示するか否か */
    const [showfield,setShowField] = useState(false);
    /** 語り部以外のプレイヤーがフィールド上から選んだカードを表示するか否か */
    const [showselected, setShowSelected] = useState(false);
    /** 語り部以外のプレイヤーがフィールド上から選んだカードのソース */
    const [src, setSrc] = useState(null);
    /** フィールドの表示内容 */
    const [field_buttons, setFieldButtons] = useState(null);


    useEffect(() => {
        /** フィールドの表示 */
        const field_selection = (data) => {
            setShowField(true);
            if(!data.player.isMaster){ // 語り部以外のプレイヤーの場合
                props.setMessage('あなたは子です(ﾟ∀ﾟ)親が出したと思うカードを選択してください(=^▽^)σ');
                setFieldButtons(
                    data.game.field.cards.map((card, index) => {
                        var id = 'field' + index;
                        var hand_src = "../images/" + card.filename;
                        return (
                        <button id={ id } type='button' onClick={ () => others_field_select(props.socket, data, index)}>
                            <img width={ WIDTH } height={ HEIGHT } src={ hand_src } alt={ card.filename }></img>
                        </button>);
                    })
                );
            }else{ // 語り部の場合
                props.setMessage('あなたは親です(ﾟ∀ﾟ)子の選択を待ちましょう( ´Д`)y━･~~');
                setFieldButtons(
                    data.game.field.cards.map((card) => {
                        var hand_src = "../images/" + card.filename;
                        return (<img width={ WIDTH } height={ HEIGHT } src={ hand_src } alt={ card.filename }></img>);
                    })
                );
                props.socket.emit('wait');
            }
        };
        /** 語り部以外のプレイヤーがフィールド上のカードを選んだときの動作 */
        const others_field_select = (socket,data,index) => {
            props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
            setShowField(false);
            setSrc("../images/" + data.game.field.cards[index].filename);
            setShowSelected(true);
            socket.emit('field_selection', {index : index});
        }
        /** フィールドの表示リセット */
        const field_reset = () => {
            setShowSelected(false);
            setShowField(false);
        }
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('field_selection' ,(data) => field_selection(data));
        props.socket.on('hand_selection' ,() => field_reset());
        props.socket.on('result' ,() => field_reset());
    }, [ props.socket ]);

    return (
        <div id='field-wrapper'>
            <div id="field" style={ {display: showfield ? 'inline' : 'none'} }>{ field_buttons }</div>
            <div className="form-inline" id="selected_field_card" style={{display: showselected ? 'inline' : 'none'}}>
                あなたがフィールドから選んだカード:
                <img id="selected_field_card" width={ WIDTH } height={ HEIGHT } src={ src } alt="フィールドから選んだカード"/>
            </div> 
        </div>
    );
}