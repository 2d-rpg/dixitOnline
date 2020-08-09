import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faKing } from "@fortawesome/fas fa-chess-pawn";
import { faChessPawn } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

import '../../css/show_role.css';

export default function ShowRole(props) {
    /** ロールを表示するか否か */
    const [showrole, setShowRole] = useState(false);
    /** プレイヤーのロール */
    const [isMaster, setIsMaster] = useState(null);

    const iconStyle =  { 'margin-right':20,'margin-left':20, 'width': 80, 'height': 80 };

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
        //props.socket.on('result' ,() => reset_role());
    }, [ props.socket ]);

    return(
    <div className="role-wrapper" style={{ textAlign: "center", padding: 50 }, {display: showrole ? 'block' : 'none'} } >
      <FontAwesomeIcon style={iconStyle}  icon={isMaster ? faCrown : faChessPawn}/>
      <span className="text">{isMaster ? "語り部" : "聞き手"}</span>
    </div>
    );
}