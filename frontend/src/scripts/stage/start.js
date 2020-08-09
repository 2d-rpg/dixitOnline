
import React, { useEffect, useState } from 'react';
import '../../css/start.css';

export default function Start(props) {
    /** スタートボタンを表示するかどうか */
    // const [show, setShow] = useState(false);
    /** プレイヤー名を表示するかどうか */
    // const [showName, setShowName] = useState(false);
    /** プレイヤー名 */
    // const [name, setName] = useState('');
    /** スタートメッセージの表示 */
    const [showStart, setShowStart] = useState(false);

    const [startMsg, setStartMsg] = useState('ゲームスタート！');

    useEffect(() => {
        /** プレイヤーが揃ったので，スタートボタンを表示 */
        // const start = (player) => {
        //     props.setMessage('準備が出来たらスタートボタンを押しましょうᕦ(ò_óˇ)ᕤ');
        //     setShow(true);
        //     setName(player.name);
        //     setShowName(true);
        //     console.log('スタート待機状態');
        // };
        const start = (player) => {
            setShowStart(true);
        };
        /** サーバから'start'がemitされたときのイベントハンドラ登録 */
        // props.socket.on('start', (data) => start(data.player));
        // props.socket.on('reconnect', (data) => props.socket.io.opts.query = { user: data.name });
        // props.socket.on('restart', () => setShowName(false));
        props.socket.on('hand_selection', (data) => start(data.player));
    }, [ props.socket ]);

    /** スタートボタンを押したときの動作 */
    // const handleclick = () => {
    //     setShow(false);
    //     props.socket.emit('start');
    //     props.setMessage('他のプレイヤーのスタートを待っています♪〜< (° ε° ) >');
    // };

    return (
        // <div>
        //     <button id="startButton" onClick={ handleclick } type="button" className="btn btn-warning" style={ {display: show ? 'inline' : 'none'} }>スタート</button>
        //     <div style={ {display: showName ? 'block' : 'none' } }>あなたの名前：{ name }</div>
        // </div>
        <div className="startMsg" onAnimationEnd={() => setStartMsg('')} style={ {display: showStart? 'block' : 'none' } }>{ startMsg }</div>
    );
}