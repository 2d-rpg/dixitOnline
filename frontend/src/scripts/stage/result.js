import React, { useEffect, useState } from 'react';

export default function Result(props) {
    /** result画面を表示するかどうか */
    const [showresult,setShowResult] = useState(false);
    /** 結果の内容 */
    const [result, setResult] = useState(null);

    useEffect(() => {
        /** result画面の表示 */
        const show_result = (data) => {
            props.setMessage('結果発表ですわぁ(⌒,_ゝ⌒)');
            let result_str = "";
            data.game.players.forEach(player => {
                result_str += player.name + ": " + player.score + "点 ";
            });
            setResult(result_str);
            setShowResult(true);
        }

        props.socket.on('result' ,(data) => show_result(data));
    }, [ props.socket ]);

    // const reset_score = () => {
    //     setShowScore(false);
    // }

    return(
        <div id="result" style={ {display: showresult ? 'inline' : 'none'} }>
            { result }
        </div>
    );
}