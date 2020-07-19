import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { $ } from 'jquery';

export default function Chat(props) {
    // const socket = io();
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = (data, event) => {
        // socket.emit('chat_send_from_client', {value : data});
        event.preventDefault();
    }

    const [chatLogs, appendMsg] = useState([]);

    // const appendMsg = (text) => {
    //     // [...chatLogs, text]
    //     $("#chatLogs").append("<div>" + text + "</div>");
    // }

    // useEffect(() => {
    //     socket.on('chat_send_from_server', (data) => appendMsg(data.value));
    // }, []);

    return (
        <div id='chat-form-wrapper'>
            <form className="form-inline" id="chatForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                <label htmlFor="msgForm">メッセージ：</label>
                <input type="text" className="form-control" id="msgForm" ref={register}/>
                </div>
                <button type="submit" className="btn btn-primary">送信</button>
            </form>
            <div id="chatLogs"></div>
        </div>
    );
}
