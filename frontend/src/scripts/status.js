import React, { useEffect } from 'react';
import PlayerName from './player_name';
import ShowScore from './stage/show_score';
import '../css/status.css';

export default function Status(props) {

    useEffect(() => {
        props.socket.on('restart',() => props.setShowStatus(false));
        props.socket.on('in_room',() => props.setShowStatus(true));
        props.socket.on('hand_selection',() => props.setShowStatus(true));
        props.socket.on('others_hand_selection',() => props.setShowStatus(true));
        props.socket.on('field_selection',() => props.setShowStatus(true));
        props.socket.on('show_answer',() => props.setShowStatus(true));
        props.socket.on('result',() => props.setShowStatus(true));
        props.socket.on('room',() => props.setShowStatus(false));
    }, [ props.socket, props.setShowStatus ]);

    return (
        <div className="player-status" style={ {display: props.showStatus ? 'block' : 'none'} }>
            <PlayerName name={ props.name }/>
            <ShowScore socket={ props.socket }/>
        </div>);
}