import React from 'react';

export default function PlayerName(props) {

    return (
        <div className="player-name">
            <div>プレイヤー名</div>
            <p>{ props.name }</p>
        </div>);
}