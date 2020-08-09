import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import '../css/chat.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Chat(props) {
    /** メッセージフォーム */
    const { register, handleSubmit, reset } = useForm();
    /** チャットログ */
    const [chatLog, appendMsg] = useState([]);
    /** メッセージを送信したときの動作 */
    const onSubmit = (data, event) => {
        props.socket.emit('chat_send_from_client', {value : data.msg});
        reset();
        event.preventDefault();
    }

    useEffect(() => {
        /** サーバからのチャット更新 */
        props.socket.on('chat_send_from_server', (data) => {
            const time = new Date();
            appendMsg((prev) => [...prev, {name: data.name, msg: data.value, time: format(time)}]);
        });
    }, [ register, props.socket ]);

    return (
        <div id='chat-form-wrapper'>
            <div id="chat-header">
                <h4>チャット</h4>
            </div>
            <div id="chatLog">
                { chatLog.map((data, index) => 
                    <div key={ 'message' + index } >
                        <div id="chatlog-name">
                            { data.name }
                        </div>
                        <div id="chatlog-msg">
                            <p>{ data.msg }</p>
                            <span class="time">{ data.time }</span>
                        </div>
                    </div>) }
            </div>
            <form className="form-inline" id="chatForm" onSubmit={ handleSubmit(onSubmit) }>
                <label htmlFor="msgForm">メッセージ：</label>
                <input type="text" className="form-control" id="message" name="msg" ref={ register() } placeholder="メッセージ"/>
                <button type="submit" className="btn btn-primary">送信</button>
            </form>
        </div>
    );
}

/** チャット入力時の日時をフォーマット */
function format(time) {
    const month = monthNames[time.getMonth()];
    const date = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour %= 12;
    hour = hour ? hour : 12;
    minute = minute < 10 ? '0' + minute : minute;
    return hour + ':' + minute + ' ' + ampm + ' | ' + month + ' ' + date;
}