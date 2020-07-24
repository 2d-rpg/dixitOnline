import {Utils} from './utils.js'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ShowScore(props) {
    useEffect(() => {
        props.socket.on('show_score' ,(data) => show_score(data));
        props.socket.on('hand_selection' ,() => reset_score());
    }, []);

    const [showscore,setShowScore] = useState(false);

    const show_score = (data) => {
        document.getElementById('score').innerHTML = data.player.score + "点";
        setShowScore(true);
        props.socket.emit('round_end');
    }

    const reset_score = () => {
        setShowScore(false);
    }

    return(
        <div id="score" style={ {display: showscore ? 'inline' : 'none'} }>
            
        </div>
    );
}