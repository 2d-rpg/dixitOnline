import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessRook, faChessPawn } from "@fortawesome/free-solid-svg-icons";
import '../css/player_list.css';

export default function PlayerList(props) {

    const [showPlayerList,setShowPlayerList] = useState(true);

    const [playerList, setPlayerList] = useState(null);

    const updatePlayerList = (players) => {
        var ret = [];
        players.sort((a,b) => {
            if( a.score > b.score ) return -1;
            if( a.score < b.score ) return 1;
            return 0;
        }).forEach((player, index) => {
            if(player.socketId == props.socket.id) {//自分かどうか
                ret[index] = (
                    <tr className="self-status">
                        <td className="status-icon">
                            <div className="status-rank">{index+1}</div>
                            <FontAwesomeIcon className={ player.isMaster?"icon-master":"icon-other"} icon={ player.isMaster ? faChessRook : faChessPawn }/>
                        </td>{/*ここに王冠*/}
                        <td><div className="status-name">{ player.name }</div></td>
                        <td><div className="status-score">{ player.score }</div></td>
                    </tr>
                );
            } else {
                ret[index] = (
                    <tr className="other-status">
                        <td className="status-icon">
                            <div className="status-rank">{index+1}</div>
                            <FontAwesomeIcon className={ player.isMaster?"icon-master":"icon-other"} icon={ player.isMaster ? faChessRook : faChessPawn }/>
                        </td>{/*ここに王冠*/}
                        <td><div className="status-name">{ player.name }</div></td>
                        <td><div className="status-score">{ player.score }</div></td>
                    </tr>
                );
            }
        })
        setPlayerList(
            ret.map((item) => {
                return(item);
            })
        );
    }

    useEffect(() => {
        // props.socket.on('restart',() => props.setShowStatus(false));
        // props.socket.on('hand_selection',() => setShowPlayerList(true));
        props.socket.on('hand_selection',(data) => updatePlayerList(data.game.players));
        props.socket.on('show_answer',(data) => updatePlayerList(data.game.players));
        props.socket.on('update_player_list',(data) => updatePlayerList(data.game.players));
    });

    return (
        <div className="player-list" style={ {display: showPlayerList ? 'block' : 'none'} }>
            <table className="table">
                { playerList }
            </table>   
        </div>
        );
}