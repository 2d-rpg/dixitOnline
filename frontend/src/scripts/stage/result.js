import React, { useEffect, useState } from 'react';

export default function Result(props) {
    useEffect(() => {
        props.socket.on('result' ,(data) => show_result(data));
    });

    const [showresult,setShowResult] = useState(false);
    const [result, setResult] = useState(null);

    const show_result = (data) => {
        let result_str = "";
        data.game.players.forEach(player => {
            result_str += player.name + ": " + player.score + "点 ";
        });
        setResult(result_str);
        setShowResult(true);
    }

    // const reset_score = () => {
    //     setShowScore(false);
    // }

    return(
        <div id="result" style={ {display: showresult ? 'inline' : 'none'} }>
            { result }
        </div>
    );
}