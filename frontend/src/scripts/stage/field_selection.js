// field_selectionステージ

import React, { useEffect, useState } from 'react';
import '../../css/field_selection.css';
import Card from '../card';

export default function FieldSelection(props) {

    /** フィールドを表示するか否か */
    const [showfield, setShowField] = useState(true);
    /** 決定済みかどうか */
    const [decided, setDecided] = useState(false);
    /** フィールド決定ボタン表示するか否か */
    const [showButton, setShowButton] = useState(false);
    /** フィールドの表示内容 */
    const [field_buttons, setFieldButtons] = useState(null);

    const [showfieldWrapper, setShowfieldWrapper] = useState(false);

    useEffect(() => {
        /** 初期化 */
        const initialize = (data) => {
            setShowField(false);
            setDecided(false);
            setShowfieldWrapper(true);
        };
        /** フィールドの表示 */
        const field_selection = (data) => {
            setShowfieldWrapper(true);
            setFieldButtons(
                data.game.field.cards.map((card, index) => {
                    var id_btn = 'eachFieldButton' + index;
                    var id_img = 'eachFieldImage' + index;
                    var field_src = "../images/default/" + card.filename;
                    const fieldRadio = <input className="eachFieldRadio" name="field-cb" id={"cb" +  id_btn } type="radio" value={id_btn}></input>;
                    const fieldButton = card.player === props.socket.id ? (
                        <p className='eachFieldButton' id={ id_btn } type='button'>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    ) : (
                        <p className='eachFieldButton' id={ id_btn } type='button' onClick={ () => selected(data, index, id_btn, field_src) }>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card radio={ fieldRadio } button={ fieldButton } kind={ 'Field' }/>);
                })
            );
            if(!data.player.isMaster){ // 語り部以外のプレイヤーの場合
                props.setMessage('あなたは子です(ﾟ∀ﾟ)親が出したと思うカードを選択してください(=^▽^)σ');
            } else { // 語り部の場合
                props.setMessage('あなたは親です(ﾟ∀ﾟ)子の選択を待ちましょう( ´Д`)y━･~~');
                props.socket.emit('wait');
            }
        };
        const selected = (data, index, id_btn) => {
            if (!decided) {
                others_field_select(props.socket, data, index);
                // TODO: getElementByIdを使っている
                document.getElementById("cb" +  id_btn).checked = !document.getElementById("cb" +  id_btn).checked;
            }
        };
        /** 語り部以外のプレイヤーがフィールド上のカードを選んだときの動作 */
        const others_field_select = (socket, data, index) => {
            if (!data.player.isMaster) { // 語り部ではない
                props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
                socket.emit('field_selection', { index : index });
                setShowButton(true);
            }
        };
        /** フィールドの表示リセット */
        const field_reset = () => {
            setShowField(false);
            setShowfieldWrapper(false);
        }
        /** フィールドの更新(裏面の状態) */
        const update_field_with_back = (game) => {
            setShowField(true);
            setFieldButtons(
                game.field.cards.map((card, index) => {
                    var id_btn = 'eachFieldButton' + index;
                    var id_img = 'eachFieldImage' + index;
                    var field_src = "../images/back/" + card.tailfilename;
                    const fieldButton = (
                        <p className='eachFieldButton' id={ id_btn } type='button'>
                            <img className='eachFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ fieldButton } kind={ 'Field' }/>);
                })
            );
        };
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('field_selection' ,(data) => field_selection(data));
        props.socket.on('hand_selection' ,(data) => initialize(data));
        props.socket.on('result' ,() => field_reset());
        props.socket.on('update_field_with_back', (data) => update_field_with_back(data.game));
    }, [ props, decided, setFieldButtons, setShowButton ]);

    const handleclick = () => {
        props.socket.emit('confirm_field_selection');
        setDecided(true);
        setShowButton(false);
    }

    return (
        <div className='field-wrapper' style={ {display: showfieldWrapper ? 'block' : 'none'} }>
            <div id="field" style={ {display: showfield ? 'inline-flex' : 'none'} }>{ field_buttons }</div>
            <button onClick={ handleclick } type="button" className="btn btn-warning fieldSelectButton" style={ {display: showButton ? 'block' : 'none'} }>これに決定</button>
        </div>
    );
}