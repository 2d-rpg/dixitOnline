import React, { useEffect, useState } from 'react';

// import { useSpring, animated } from 'react-spring';
import '../css/card.css';
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
    
    useEffect(() => {
        if (props.card.status == 'hand') {
            let margin = 100 * props.index;
            setX('calc(10% + '+ margin + 'px)');
            setY('70%');
        }
        var id_btn = 'eachHandButton' + props.index;
        var id_img = 'eachHandImage' + props.index;
        var hand_src = "./images/default/" + props.card.filename;
        setContent(
            <p className='eachHandButton' id={ id_btn } type='button' data-toggle="modal" data-target="#exampleModalCenter">
                <img className='eachHandImage' id={ id_img } src={ hand_src } alt={ props.card.filename }></img>
            </p>
        );
    },[]);
    
    return (
        <div className="card" style={{top: positionY, left: positionX, display: display}}>
            {/* {showButton && (
                <button
                onClick={() => setShowMessage(true)}
                size="lg"
                >
                    <div>{ "butoon" }</div>
                </button>
            )} */}
            <CSSTransition
                in={showMessage}
                timeout={300}
                classNames="alert"
                unmountOnExit
                onClick={() => clickCard()}
                onEnter={() => setShowButton(true)}
                onExited={() => setShowButton(true)}
            >
                <div>{ "こーこーだーよー" }</div>
                {/* <button onClick={() => setShowMessage(true)} size="lg">
                    
                </button> */}
            </CSSTransition>
        </div>
    );
}
