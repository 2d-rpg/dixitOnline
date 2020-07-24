import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';

export default function Chat(props) {
    const { register, handleSubmit, reset } = useForm();
    const [chatLog, appendMsg] = useState([]);

    const onSubmit = (data, event) => {
        console.log(data.msg);
        props.socket.emit('chat_send_from_client', {value : data.msg});
        reset();
        event.preventDefault();
    }

    useEffect(() => {
        props.socket.on('chat_send_from_server', (data) => {
            appendMsg((prev) => [...prev, {name: data.name, msg: data.value}]);
        });
    }, [ register, props.socket ]);

    return (
        <div id='chat-form-wrapper'>
            <form className="form-inline" id="chatForm" onSubmit={ handleSubmit(onSubmit) }>
                <label htmlFor="msgForm">メッセージ：</label>
                <input type="text" className="form-control" id="message" name="msg" ref={ register() } placeholder="メッセージ"/>
                <button type="submit" className="btn btn-primary">送信</button>
            </form>
            <div id="chatLog">{ chatLog.map((data, index) => <div key={ 'message' + index } >{ data.name + ': ' + data.msg }</div>) }</div>
        </div>
    );
}
