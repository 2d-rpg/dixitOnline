import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessRook, faChessPawn } from "@fortawesome/free-solid-svg-icons";
import '../css/player_list.css';

export default function PlayerList(props) {

    const [showPlayerList, setShowPlayerList] = useState(true);

    const [playerList, setPlayerList] = useState(null);

    useEffect(() => {
        /** プレイヤーリストの更新 */
        const updatePlayerList = (players) => {
            setPlayerList(
                players.sort((a,b) => {
                    if( a.score > b.score ) return -1;
                    if( a.score < b.score ) return 1;
                    return 0;
                }).map((player, index) => {
                    const ret = (player.socketId == props.socket.id) ? (//自分かどうか
                            <tr className="self-status">
                                <td className="status-icon">
                                    <div className="status-rank">{ index + 1 }</div>
                                    <FontAwesomeIcon className={ player.isMaster?"icon-master":"icon-other"} icon={ player.isMaster ? faChessRook : faChessPawn }/>
                                </td>
                                <td><div className="status-name">{ player.name }</div></td>
                                <td><div className="status-score">{ player.score }</div></td>
                            </tr>
                    ) : (
                            <tr className="other-status">
                                <td className="status-icon">
                                    <div className="status-rank">{ index + 1 }</div>
                                    <FontAwesomeIcon className={ player.isMaster?"icon-master":"icon-other"} icon={ player.isMaster ? faChessRook : faChessPawn }/>
                                </td>
                                <td><div className="status-name">{ player.name }</div></td>
                                <td><div className="status-score">{ player.score }</div></td>
                            </tr>
                    )
                    return(ret);
                })
            );
        }
        props.socket.on('hand_selection', (data) => updatePlayerList(data.game.players));
        props.socket.on('show_answer', (data) => updatePlayerList(data.game.players));
        props.socket.on('update_player_list', (data) => updatePlayerList(data.game.players));
        props.socket.on('restart', (data) => updatePlayerList(data.game.players));
    }, [ props ]);

    return (
        <div className="player-list" style={ {display: showPlayerList ? 'block' : 'none'} }>
            <table className="table">
                { playerList }
            </table>   
        </div>
        );
}