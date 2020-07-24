import React, { useEffect, useState } from 'react';

export default function ShowAnswer(props) {
    useEffect(() => {
        props.socket.on('show_answer' ,(data) => show_answer(data));
        props.socket.on('hand_selection' ,() => reset_answer());
        props.socket.on('result' ,() => reset_answer());
    });

    const [showanswer,setShowAnswer] = useState(false);
    const [src, setSrc] = useState('');

    const show_answer = (data) => {
        let filename = data.game.field.masterCard.filename;
        setSrc("../images/" + filename + ".jpg");
        setShowAnswer(true);
        props.socket.emit('calc_score');
    }

    const reset_answer = () => {
        setShowAnswer(false);
    }

    return(
        <div id="answer" style={ {display: showanswer ? 'inline' : 'none'} }>
            答えがこれ
            <img id="answer_card" src={ src } width="200" height="200" alt="語り部のカード"/>
        </div>
    );
}