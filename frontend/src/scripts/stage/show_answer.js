import React, { useEffect, useState } from 'react';
import '../../css/show_answer.css';

export default function ShowAnswer(props) {
    /** 答えを表示するかどうか */
    const [showanswer,setShowAnswer] = useState(false);
    /** 答えのソース */
    const [src, setSrc] = useState('');

    useEffect(() => {
        /** 答えの表示 */
        const show_answer = (data) => {
            let filename = data.game.field.masterCard.filename;
            setSrc("../images/default/" + filename);
            setShowAnswer(true);
            setTimeout(() => {
                props.socket.emit('calc_score');
            }, 3000);
        }
        /** 答えの表示リセット */
        const reset_answer = () => {
            setShowAnswer(false);
        }
        /** サーバからのemitされたときのイベントハンドラ一覧 */
        props.socket.on('show_answer' ,(data) => show_answer(data));
        props.socket.on('hand_selection' ,() => reset_answer());
        props.socket.on('result' ,() => reset_answer());
    }, [ props.socket ]);

    return(
        <div className='answer-wrapper' id="answer" style={ {display: showanswer ? 'inline' : 'none'} }>
            答えがこれ
            <img id="answer_card" src={ src } width="200" height="200" alt="語り部のカード"/>
        </div>
    );
}