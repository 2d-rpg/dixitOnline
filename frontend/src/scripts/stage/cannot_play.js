// cannot_play画面
import React, { useEffect } from 'react';

export default function CannotPlay(porps) {

    useEffect(() => {
        porps.socket.on('restart', () => restart());
    });

    const restart = () => {
        porps.socket.emit('init');
    };

    return(<div></div>);

}