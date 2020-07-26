import React, {useState, useEffect} from 'react';

export default function PlayerCounter(prop) {
    /** 現在のプレイヤー人数 */
    const [player_num, setPlayerNum] = useState(0);

    useEffect(() => {
        // 人数表示更新
        prop.socket.on('update_number_of_player', (data) => setPlayerNum(data.num));
    });

    return (
        <div id="numOfPeople">現在のプレイヤー人数：{ player_num }人</div>
    );
}