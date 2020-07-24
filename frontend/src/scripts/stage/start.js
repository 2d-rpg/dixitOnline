
import React, { useEffect, useState } from 'react';
// const startButton = document.getElementById('startButton');

// export class Start {

//     static do() {
//         startButton.style.display = 'block';
//         console.log('[debug] スタート待機状態');
//         const message = '参加登録しましょう';
//         document.getElementById('progress').innerHTML = message;
//     }

//     static push(socket, context, canvas) {
//         startButton.style.display = 'none';

//         //とりあえずcanvas非表示設定にしてあります
//         // Utils.clearDisplay();
//         // const fontSize = 20;
//         // context.font = fontSize + 'px Bold Arial';
//         // const message = '他の参加者がスタートするのを待っています...';
//         // // メッセージをcanvas中央に配置
//         // context.fillText(message, canvas.width / 2 - message.length * fontSize / 2, canvas.height / 2 - fontSize / 2);

//         const message = '他の参加者がスタートするのを待っています...';
//         document.getElementById('progress').innerHTML = message;
        
//         socket.emit('start');
//     }
// }

export default function Start(props) {

    const [show, setShow] = useState(false);
    const [showName, setShowName] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        props.socket.on('start', (data) => start(data.player));
    });

    const start = (player) => {
        setShow(true);
        setName(player.name);
        setShowName(true);
        console.log('スタート待機状態');
    };

    const handleclick = () => {
        setShow(false);
        props.socket.emit('start');
    };

    return (
        <div>
            <button id="startButton" onClick={handleclick} type="button" className="btn btn-warning" style={ {display: show ? 'inline' : 'none'} }>スタート</button>
            <div style={ {display: showName ? 'block' : 'none' } }>あなたの名前：{ name }</div>
        </div>
    );
}