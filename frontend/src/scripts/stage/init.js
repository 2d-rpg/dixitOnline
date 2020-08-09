import React, {useEffect, useState} from 'react';

function Init(props) {
    const [id, setID] = useState(null);

    useEffect(() => {
        /** サーバに'init'をemitする */
        const init = (socket) => {
            setID(socket.id);
            socket.emit('init');
        };
        /** サーバ接続時のイベントハンドラ登録 */
        props.socket.on('connect', () => init(props.socket));
        props.socket.on('disconnect', (reason) => {
            if(reason === 'io server disconnect') {
                props.socket.open();
            }
        });
    }, [ props.socket ]);

    return(<div>{ id }</div>);
}

export default Init;