
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../css/upload.css';

export default function Upload(props) {
    /** エントリーフォームの表示 */
    const [showLeave, setShowLeave] = useState(false);

    useEffect(() => {
        props.socket.on('room', () => setShowLeave(false));
        props.socket.on('show_start', () => setShowLeave(true));
        props.socket.on('hand_selection', () => setShowLeave(false));
        props.socket.on('entry_player', (data) => setShowLeave(true));
        props.socket.on('in_room', (data) => setShowLeave(true));
        props.socket.on('result' ,(data) => setShowLeave(true));
    }, [ props.socket, setShowLeave ]);

    const handleleave = () => {
        console.log("leave");
        props.socket.emit('leave');
    }

    return (
        <button onClick={ handleleave } id="create-room-button" style={ {display: showLeave ? 'block' : 'none' } } className="btn btn-primary mb-2">
            ルームを退出
        </button>
    );
}