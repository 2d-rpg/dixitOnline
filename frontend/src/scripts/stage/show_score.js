import React, { useEffect, useState } from 'react';

export default function ShowScore(props) {
    useEffect(() => {
        props.socket.on('show_score' ,(data) => show_score(data));
        props.socket.on('result' ,() => reset_score());
    });

    const [showscore,setShowScore] = useState(true);

    const show_score = (data) => {
        document.getElementById('score').innerHTML = data.player.score + "点";
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