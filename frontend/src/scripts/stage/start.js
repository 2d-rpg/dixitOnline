
import React, { useEffect, useState } from 'react';

export default function Start(props) {
    /** スタートボタンを表示するかどうか */
    const [show, setShow] = useState(false);
    /** プレイヤー名を表示するかどうか */
    const [showName, setShowName] = useState(false);
    /** プレイヤー名 */
    const [name, setName] = useState('');

    useEffect(() => {
        /** プレイヤーが揃ったので，スタートボタンを表示 */
        const start = (player) => {
            setShow(true);
            setName(player.name);
            setShowName(true);
            console.log('スタート待機状態');
        };
        /** サーバから'start'がemitされたときのイベントハンドラ登録 */
        props.socket.on('start', (data) => start(data.player));
    }, [ props.socket ]);

    /** スタートボタンを押したときの動作 */
    const handleclick = () => {
        setShow(false);
        props.socket.emit('start');
    };

    return (
        <div>
            <button id="startButton" onClick={handleclick} type="button" className="btn btn-warning" style={ {display: show ? 'inline' : 'none'} }>スタート</button>
            <div style={ {display: showName ? 'block' : 'none' } }>あなたの名前：{ name }</div>
        </div>
    );
}