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

    const [ret, setRet] = useState(null);
    
    const [style, setStyle] = useState({
        left: 100*props.index+'px',
    });

    var id_btn = 'eachHandButton' + props.index;
    var id_img = 'eachHandImage' + props.index;
    var hand_src = "../images/default/" + props.card.filename;
    
    useEffect(() => {
        const click = () => {
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
        }
        // props.socket.on('')
        setRet( 
        // <p className='eachHandButton' id={ id_btn } type='button' onClick={() => click}>
        //     <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ props.card.filename }></img>
        // </p>
        <p id={ id_btn } type='button' onClick={() => click}>
            <img id={ id_img } src={ hand_src } alt={ props.card.filename }></img>
        </p>
        );
        
    },[]);
    
    return (
        <div className="card" style={style}>
            <div className="card-content">
                {ret}
            </div>
        </div>
    );
}
