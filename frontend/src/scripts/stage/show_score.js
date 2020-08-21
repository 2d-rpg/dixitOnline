import React, { useEffect, useState } from 'react';
import '../../css/show_score.css';

export default function ShowScore(props) {
    /** スコアを表示するか否か */
    const [showscore, setShowScore] = useState(false);
    /** プレイヤーのスコア */
    const [score, setScore] = useState(null);

    const [player, setPlayerName] = useState();// 残しといて　ユーザのリスト表示に使うかも

    useEffect(() => {
        /** スコアの表示 */
        const show_score = (data) => {
            setShowScore(true);
            setScore(data.player.score);
            console.log(data.others);
            // setTimeout(() => {
            //     props.socket.emit('round_end');
            // }, 3000);
        }
        const end = () => {
            setTimeout(() => {
                props.socket.emit('round_end');
            }, 3000);
        }
        /** スコアの表示リセット */
        const reset_score = () => {
            setShowScore(false);
        }
        /** サーバからemitされたときのイベントハンドラ一覧 */
        // props.socket.on('show_score' ,(data) => end(data));
        props.socket.on('hand_selection' ,(data) => show_score(data));
        props.socket.on('result' ,() => reset_score());
    }, [ props.socket ]);

    return(
        <div id="score" style={ {display: showscore ? 'inline' : 'none'} }>
            <div className="othersScore">
                <ul>
                    {}
                </ul>
            </div>
            <div className="yourScore">
                スコア：<br/>
                { score }
                点
            </div>
        </div>
    );
}