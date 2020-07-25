// cannot_play画面
import React, { useEffect } from 'react';

export default function CannotPlay(porps) {

    useEffect(() => {
        const restart = () => {
            porps.socket.emit('init');
        };

        porps.socket.on('restart', () => restart());
    }, [ props.socket ]);

    return(<div></div>);

}