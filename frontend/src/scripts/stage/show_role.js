import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessPawn, faChessRook } from "@fortawesome/free-solid-svg-icons";

import '../../css/show_role.css';

export default function ShowRole(props) {
    /** ロールを表示するか否か */
    const [showrole, setShowRole] = useState(false);
    /** プレイヤーのロール */
    const [isMaster, setIsMaster] = useState(null);

    const iconStyle =  { 'width': 60, 'height': 60 };

    useEffect(() => {
        /** スコアの表示 */
        const show_role = (data) => {
            //setSrc("../images/default/" + data.player.hand._array[index].filename);
            if(data.player.isMaster){
                setIsMaster(true);
            }else{
                setIsMaster(false);
            }
            setShowRole(true);
        }
        /** スコアの表示リセット */
        const reset_role = () => {
            setShowRole(false);
        }
        /** サーバからemitされたときのイベントハンドラ一覧 */
        props.socket.on('hand_selection' ,(data) => show_role(data));
        props.socket.on('others_hand_selection',(data) => show_role(data));
        props.socket.on('field_selection',(data) => show_role(data));
        props.socket.on('show_answer',(data) => show_role(data));
        props.socket.on('result',(data) => show_role(data));
        props.socket.on('restart',() => reset_role());
        props.socket.on('room',() => setShowRole(false));
        props.socket.on('in_room',() => setShowRole(false));
    }, [ props.socket ]);

    return(
    <div className="role-wrapper" style={ { textAlign: "center", display: showrole ? 'block' : 'none', padding: "50" } } >
        <div className="role-container">
            <FontAwesomeIcon className="role-figure" style={ iconStyle }  icon={ isMaster ? faChessRook : faChessPawn } color={ isMaster ? "gold" : "seashell" }/>
            <span className="text">{ isMaster ? "語り部" : "聞き手" }</span>
        </div>
    </div>
    );
}