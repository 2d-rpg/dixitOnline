import React, {useState, useEffect} from 'react';
import { io } from 'socket.io-client';

export default function Progress(props) {
    // 文章を集約
    let htmlText = "";
    let waiting = "参加プレイヤーが集まるのを待っています...";
    
    useEffect(() => {
        props.socket.on('start' ,(data) => {
            htmlText = waiting;
        });
        props.socket.on('entry' ,(data) => {
            htmlText = waiting+"fffff";
        });
        props.socket.on('hand_selection' ,() => {

        });
    }, []);

    return (
        <div id="progress">{htmlText}</div>
    );
}