import React, { useEffect, useState } from 'react';
import PlayerName from './player_name';
import ShowScore from './stage/show_score';
import '../css/status.css';

export default function Status(props) {

    useEffect(() => {
        props.socket.on('restart',() => props.setShowStatus(false));
    }, [ props ]);

    return (
        <div className="player-status" style={ {display: props.showStatus ? 'block' : 'none'} }>
            <PlayerName name={ props.name }/>
            <ShowScore socket={ props.socket }/>
        </div>);
}