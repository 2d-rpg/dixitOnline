import React, {useState, useEffect} from 'react';
import { io } from 'socket.io-client';

export default function PlayerCounter() {
    // const socket = io();

    useEffect(() => {
        // 人数表示更新
        // const socket = io();
        // socket.on('update_number_of_player', (data) => updateNumOfPepole(data.num));
    });

    const updateNumOfPepole = (num) => {
        let message = '現在のプレイヤー人数：' + num + '人'
        document.getElementById('numOfPeople').innerHTML = message;
    }

    return (
        <div id="numOfPeople">現在のプレイヤー人数：0人</div>
    );
}