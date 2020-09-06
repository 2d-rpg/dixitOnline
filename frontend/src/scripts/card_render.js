// master_hand_selectionステージ

import React, { useEffect, useState } from 'react';
import Card from './card';
import '../css/card.css';
import '../css/hand_selection.css';

export default function CardRender(props) {
    const [show, setShow] = useState(true);

    const [cards, setCards] = useState(null);
    
    useEffect(() => {
        const render = (data) => {
            setShow(true);
            setCards(
                data.player.hand._array.map((card, index) => {
                    return(<Card data={data} card={card} index={index}/>);
                })
            );
        };
        
        /** サーバーからのemitを受け取るイベントハンドラ一覧 */
        props.socket.on('hand_selection' ,(data) => render(data));
        props.socket.on('others_hand_selection',(data) => render(data));
        props.socket.on('card_status_update',(data) => render(data));
    }, [ props ]);


    return (
        <div className="card-render" style={ {display: show ? 'block' : 'none'} }>
            { cards }
        </div>
    );
}