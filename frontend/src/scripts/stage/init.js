import React, {useEffect} from 'react'

function Init(props) {

    useEffect(() => {
        /** サーバに'init'をemitする */
        const init = (socket) => {
            socket.emit('init');
        };
        /** サーバ接続時のイベントハンドラ登録 */
        props.socket.on('connect', () => init(props.socket));
    }, [ props.socket ]);

    return(<div></div>);
}

export default Init;