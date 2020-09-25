import React from 'react';

export default function PlayerName(props) {

    return (
        <div className="player-name">
            <div>NAME</div>
            <p>{ props.name }</p>
        </div>);
}