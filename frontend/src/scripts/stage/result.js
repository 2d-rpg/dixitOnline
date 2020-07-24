import {Utils} from './utils.js'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Result(props) {
    useEffect(() => {
        props.socket.on('result' ,(data) => show_result(data));
    }, []);

    const [showresult,setShowResult] = useState(false);

    const show_result = (data) => {
        let result = "";
        data.game.players.forEach(player => {
            result += player.score + "点";
        });
        document.getElementById('result').innerHTML = result;
        setShowResult(true);
    }

    // const reset_score = () => {
    //     setShowScore(false);
    // }

    return(
        <div id="result" style={ {display: showresult ? 'inline' : 'none'} }>
            
        </div>
    );
}