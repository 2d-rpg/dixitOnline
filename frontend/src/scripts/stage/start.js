
import React, { useEffect, useState } from 'react';
import '../../css/start.css';

/**
 * スタートメッセージの表示
 * @param {{ socket: SocketIO.Socket }} props 連想配列として，socketをもつ
 */
export default function Start(props) {
    /** スタートメッセージの表示 */
    const [showStart, setShowStart] = useState(false);
    /** スタートメッセージの内容 */
    const [startMsg, setStartMsg] = useState('ゲームスタート！');

    useEffect(() => {
        /** socketのイベントハンドラ登録一覧 */
        props.socket.on('hand_selection', () => setShowStart(true));

    }, [ props.socket ]);

    return (
        <div className="startMsg" onAnimationEnd={ () => setShowStart(false) } style={ { display: showStart ? 'block' : 'none' } }>{ startMsg }</div>
    );
}