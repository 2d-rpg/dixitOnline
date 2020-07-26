import React, { useEffect, useState } from 'react';

export default function ShowScore(props) {
    /** スコアを表示するか否か */
    const [showscore, setShowScore] = useState(true);
    /** プレイヤーのスコア */
    const [score, setScore] = useState(null);

    useEffect(() => {
        /** スコアの表示 */
        const show_score = (data) => {
            setScore('あなたのスコア: ' + data.player.score + "点");
            props.socket.emit('round_end');
        }
        /** スコアの表示リセット */
        const reset_score = () => {
            setShowScore(false);
        }
        /** サーバからemitされたときのイベントハンドラ一覧 */
        props.socket.on('show_score' ,(data) => show_score(data));
        props.socket.on('result' ,() => reset_score());
    }, [ props.socket ]);

    return(
        <div id="score" style={ {display: showscore ? 'inline' : 'none'} }>
           { score } 
        </div>
    );
}