import {Utils} from './utils.js'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ShowAnswer(props) {
    useEffect(() => {
        props.socket.on('show_answer' ,(data) => show_answer(data));
    }, []);

    const [showanswer,setShowAnswer] = useState(false);

    const show_answer = (data) => {
        let filename = data.game.field.masterCard.filename;
        document.getElementById('answer_card').setAttribute('src', "../images/" + filename + ".jpg");
        setShowAnswer(true);
        props.socket.emit('calc_score');
    }

    return(
        <div id="answer" style={ {display: showanswer ? 'inline' : 'none'} }>
            答えがこれ
            <img id="answer_card" width="200" height="200"/>
        </div>
    );
}