import React, { useEffect, useState } from 'react';

export default function ShowScore(props) {
    /** プレイヤーのスコア */
    const [score, setScore] = useState(0);

    useEffect(() => {
        /** スコアの表示 */
        const show_score = (data) => {
            setScore(data.player.score);
        }
        /** サーバからemitされたときのイベントハンドラ一覧 */
        props.socket.on('show_answer', (data) => show_score(data));
    }, [ props.socket ]);

    return(
        <div id="score">
            <div>SCORE</div>
            <div>{ score }点</div>
        </div>
    );
}