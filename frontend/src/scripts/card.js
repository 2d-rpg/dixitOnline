import React, { useEffect, useState } from 'react';

// import { useSpring, animated } from 'react-spring';
import '../css/card.css';
import '../css/hand_selection.css';
import {CSSTransition} from 'react-transition-group';


/** カードのスケール．変更したい場合はここを変える． */
// const CARD_SCALE = 1.2;
/** カードの拡大スケール */
// const zoomup = () => CARD_SCALE;
/** カードのスケールを設定 */
// const trans = (scale) => `perspective(600px) scale(${scale})`;

/**
 * カードの要素．この中にボタンがあり，ボタンの中に画像が埋め込まれている．
 * コメントアウトしているのはreact-springを用いた場合の実装，動作が重くなるので，現在はcssで実装している．
 */
export default function Card(props) {
    const [positionX, setX] = useState('90%');
    const [positionY, setY] = useState('50%');
    const [display, setDisplay] = useState('block');
    const [content, setContent] = useState(null);

    const [inProp, setInProp] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    
    const [style, setStyle] = useState({
        position: 'absolute',
    });

    var id_btn = 'eachHandButton' + props.index;
    var id_img = 'eachHandImage' + props.index;
    var hand_src = "../images/default/" + props.card.filename;

    const click = () => {
        master_select(props.data, props.index);
    }

    const master_select = (data, index) => {
        if(data.player.isMaster){
            props.setMasterIndex(index);
            story_selection(data, index);
        }else{
            //TODO:子の表示
        }
    };
    const story_selection = (data, index) => {
        props.setMessage('あなたは親です(ﾟ∀ﾟ)カードのお題を入力してください⊂((・x・))⊃');
        const selectedSrc = "../images/default/" + data.player.hand._array[index].filename;
        props.setSrc(
            <p className="selectedButton" id="selected-hand-card-wrapper">
                <img className="selectedImage" src={ selectedSrc } alt="あなたが選んだカード"/> 
            </p> );
    };
    
    useEffect(() => {
        
        if (props.card.status == 'hand') {
            let positionX = 300 - props.index*100;
            let positionY = -500;
            setStyle(
                {
                    transform: 'translate('+positionX+'px,'+positionY+'px)',
                }
            );
        } else if(props.card.status == 'field') {
            let positionX = 0;
            let positionY = 500;
            setStyle(
                {
                    transform: 'translate('+positionX+'px,'+positionY+'px)',
                }
            );
        }
        
        /** 語り部が手札から選んだカードの表示と手札の非表示及びお題フォームの表示 */
        
    },[]);
    
    return (
        <div className="card">
            <div className="card-content" style={style}>
                <p className='eachHandButton' id={ id_btn } type='button' onClick={() => click}>
                    <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ props.card.filename }></img>
                </p>
            </div>
        </div>
    );
}
