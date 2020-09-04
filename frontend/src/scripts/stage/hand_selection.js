// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';
import { useTransition, a } from 'react-spring';
import $ from 'jquery';
import Card from '../card';
import '../../css/hand_selection.css';

export default function HandSelection(props) {
    /** 手札を表示するか否か */
    const [showhand,setShowHand] = useState(false);
    /** 手札の内容 */
    const [hand_buttons, setHandButtons] = useState(null);

    const [handData, setHandData] = useState([]);

    let gridItems = handData.map((child, i) => {
        let xy = [(300 / 6) * i, 0];
        let opacity = 1;
        if(i == props.index) {
            xy = [200, -200];
            opacity = 0;
        }else if(i > props.index){
            i -= 1;
            xy = [(300 / 6) * i, 0];
        }
        return { filename: child.filename, xy, width: 300 / 6, height: 150 / 2, opacity : opacity}
    })
    // Hook5: Turn the static grid values into animated transitions, any addition, removal or change will be animated
    const transitions = useTransition(gridItems, item => item.filename, {
        from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
        enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
        update: ({ xy, width, height, opacity }) => ({ xy, width, height, opacity}),
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100, duration: 200},
        trail: 25
    })

    useEffect(() => {
        const update_hand_data = (data) => {
            // props.setIndex(10);
            setHandData(data.handData);
        }
        /** 手札の表示 */
        const hand_selection = (data) => {
            setShowHand(true);
            // リセット
            setHandButtons(
                // data.player.hand._array.map((card, index) => {
                transitions.map(({ item, props: { xy, ...rest }, key }, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + item.filename;
                    const handButton = data.player.isMaster? (
                        <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => master_select(data, index)} data-toggle="modal" data-target="#exampleModalCenter">
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ item.filename }></img>
                        </p> 
                    ) : (
                        <p className='eachHandButton' id={ id_btn } type='button'>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ item.filename }></img>
                        </p>
                    );
                    // return (<Card button={ handButton } kind={ 'Hand' } card={card}/>);
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
                console.log(gridItems);
                setHandButtons(
                    // data.player.hand._array.map((card, index) => {
                    transitions.map(({ item, props: { xy, ...rest }, key }, index) => {
                        var id_btn = 'eachHandButton' + index;
                        var id_img = 'eachHandImage' + index;
                        var hand_src = "../images/default/" + item.filename;
                        const handButton = (
                            <p className='eachHandButton' id={ id_btn } type='button' onClick={ () => others_select(props.socket ,data, index)}>
                                <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ item.filename }></img>
                            </p>
                        );
                        // return (<Card button={ handButton } kind={ 'Hand' }/>);
                    })
                );
            }
        };
        /**語り部以外のプレイヤーが手札からカードを選んだときの動作 */
        const others_select = (socket, data, index) => {
            props.setIndex(index);
            props.setMessage('あなたは子です(ﾟ∀ﾟ)他の子の選択を待ちましょう( ´Д`)y━･~~');
            const selectedSrc = "../images/default/" + data.player.hand._array[index].filename;
            props.setSrc(
                <p className="selected-handcard-wrapper" id="selected-hand-card-wrapper">
                    <img id="selected-hand-card" src={ selectedSrc } alt="あなたが選んだカード"/> 
                </p> );
            socket.emit('others_hand_selection', {index : index});
        };
        /** 手札の更新 */
        const update_hand = (player) => {
            setHandData(player.hand._array);
            setHandButtons(
                // player.hand._array.map((card, index) => {
                transitions.map(({ item, props: { xy, ...rest }, key }, index) => {
                    var id_btn = 'eachHandButton' + index;
                    var id_img = 'eachHandImage' + index;
                    var hand_src = "../images/default/" + item.filename;
                    const handButton = (
                        <p className='eachHandButton' id={ id_btn } type='button'>
                            <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ item.filename }></img>
                        </p>
                    );
                    // return (<Card button={ handButton } kind={ 'Hand' }/>);
                })
            );
        };
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('update_hand_data' ,(data) => update_hand_data(data));
        props.socket.on('hand_selection' ,(data) => hand_selection(data));
        props.socket.on('others_hand_selection',(data) => others_hand_selection(data));
        props.socket.on('update_hand',(data) => update_hand(data.player));
        props.socket.on('restart',() => setShowHand(false));
    }, [ props, handData, transitions, gridItems ]);

    return (
        <div className="hand-wrapper" style={ {display: showhand ? 'block' : 'none'} }>
            <div className="hand-content">
                <div id="hand">{ hand_buttons }</div>
            </div>
        </div>
    );
}