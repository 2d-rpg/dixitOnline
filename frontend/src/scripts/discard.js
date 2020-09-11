import React, { useState, useEffect } from 'react';
import Card from './card';
import '../css/discard.css';

export default function Discard(props) {

    /** 墓地の表示 */
    const [discard, setDiscard] = useState(null);

    const [showDiscard,setShowDiscard] = useState(false);

    useEffect(() => {

        const update_discard = (data) => {
            setShowDiscard(true);
            setDiscard(
                data.game.discard._array.map((card, index) => {
                    var id_btn = 'eachDiscardButton' + index;
                    var id_img = 'eachDiscardImage' + index;
                    var field_src = "../images/default/" + card.filename;
                    var rotate = Math.random() * 20 - 10;
                    var shiftX = Math.random() * 10 - 5;
                    var shiftY = Math.random() * 10 - 5;
                    const style = { transform: `rotate(${rotate}deg) translate(${shiftX}px, ${shiftY}px)` };
                    const discardButton = (
                        <p className='eachDiscardButton' id={ id_btn } type='button'>
                            <img className='eachDiscardImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ discardButton } style={ style } kind={ "Discard" }/>)
                })
            )
        };
        props.socket.on('hand_selection', (data) => update_discard(data));
        props.socket.on('restart', () => setShowDiscard(false));
    });

    return(<div className="discard" style={ {display: showDiscard ? 'block' : 'none'} }>{ discard }</div>)
}