import React, { useEffect, useState } from 'react';
import PlayerName from './player_name';
import ShowScore from './stage/show_score';
import '../css/status.css';

export default function Status(props) {

    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        props.socket.on('hand_selection',() => setShowStatus(true));
        props.socket.on('restart',() => setShowStatus(false));
    });

    return (
        <div className="player-status" style={ {display: showStatus ? 'block' : 'none'} }>
            <PlayerName name={ props.name }/>
            <ShowScore socket={ props.socket }/>
        </div>);
}