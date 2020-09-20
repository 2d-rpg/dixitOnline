
import React, { useState, useEffect } from 'react';
import '../css/upload.css';

export default function Upload(props) {
    /** 退室ボタンの表示 */
    const [showLeave, setShowLeave] = useState(false);

    const className = "btn btn-warning mb-2 " + props.className;

    useEffect(() => {
        props.socket.on('room', () => setShowLeave(false));
        props.socket.on('show_start', () => setShowLeave(true));
        props.socket.on('hand_selection', () => setShowLeave(false));
        props.socket.on('entry_player', (data) => setShowLeave(true));
        props.socket.on('in_room', (data) => setShowLeave(true));
        props.socket.on('result' ,(data) => setShowLeave(true));
        props.socket.on('restart' ,(data) => setShowLeave(true));
    }, [ props.socket, setShowLeave ]);

    const handleleave = () => {
        console.log("leave");
        if(typeof props.handle !== 'undefined') {
            props.handle();
        }
        props.socket.emit('leave');
    }

    return (
        <button onClick={ handleleave } id="leave-room-button" style={ {display: showLeave ? 'block' : 'none' } } className={ className } >
            ルーム退室
        </button>
    );
}