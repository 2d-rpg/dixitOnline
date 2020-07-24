import {Utils} from './utils.js'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ShowScore(props) {
    useEffect(() => {
        props.socket.on('show_score' ,(data) => show_score(data));
    }, []);

    const [showscore,setShowScore] = useState(false);

    const show_score = (data) => {
        document.getElementById('score').innerHTML = data.player.score + "点";
        setShowScore(true);
        // props.socket.emit('');
    }

    return(
        <div id="score" style={ {display: showscore ? 'inline' : 'none'} }>
            
        </div>
    );
}