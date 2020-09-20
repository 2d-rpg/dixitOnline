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
            <div className="outer-border">
                <div className="mid-border">
                    <div className="inner-border">
                        <img className="corner-decoration corner-left-top" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/> 
                        <img className="corner-decoration corner-right-top" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/>
                        <img className="corner-decoration corner-right-bottom" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/>
                        <img className="corner-decoration corner-left-bottom" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"/>
                        <div className="player-status-container">
                            <PlayerName name={ props.name }/>
                            <ShowScore socket={ props.socket }/>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}