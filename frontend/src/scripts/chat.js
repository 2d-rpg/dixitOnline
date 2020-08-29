import React, {useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faComment } from '@fortawesome/free-solid-svg-icons';
import '../css/chat.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Chat(props) {
    /** メッセージフォーム */
    const { register, handleSubmit, reset } = useForm();
    /** チャットログ */
    const [chatLog, appendMsg] = useState([]);
    /** チャットログの参照 */
    const chatLogElement = useRef();
    /** チャットフォームの参照 */
    const chatFormElement = useRef();

    /** メッセージを送信したときの動作 */
    const onSubmit = (data, event) => {
        if (data.msg === '') return;
        props.socket.emit('chat_send_from_client', {value : data.msg});
        reset();
        event.preventDefault();
    }

    useEffect(() => {
        /** サーバからのチャット更新 */
        props.socket.on('chat_send_from_server', (data) => {
            const time = new Date();
            appendMsg((prev) => [...prev, { name: data.name, msg: data.value, time: format(time), self: props.socket.id === data.socketId }]);
            chatLogElement.current.scrollTop = chatLogElement.current.scrollHeight;
        });


    }, [ register, props.socket, chatLogElement ]);

    return (
        <div className='chat-form-wrapper'>
            <div className="chat-header">
                <h4><span className="chat-icon"><FontAwesomeIcon icon={ faComment }/></span> チャット</h4>
            </div>
            <div className="chat-log-wrapper">
                <div id="chatLog" ref={ chatLogElement }>
                    { chatLog.map((data, index) => 
                        data.self ? (
                            <div className="outgoing-chats" key={ 'message' + index }>
                                <div className="outgoing-msg">
                                    <div className="outgoing-chats-msg">
                                        <div className="outgoing-msg-inbox">
                                            <p>{ data.msg }</p>
                                            <span className="time">{ data.time }</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="received-chats" key={ 'message' + index }>
                                <div className="received-chats-name">
                                    { data.name }
                                </div>
                                <div className="received-msg">
                                    <div className="received-chats-msg">
                                        <div className="received-msg-inbox">
                                            <p>{ data.msg }</p>
                                            <span className="time">{ data.time }</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) }
                </div>
            </div>
            <div className="chat-bottom">
                <div className="input-msg-group">
                    <form className="form-inline chat-form-content" id="chatForm" ref={ chatFormElement } onSubmit={ handleSubmit(onSubmit) }>
                        <input type="text" className="form-control chat-input" id="message" name="msg" ref={ register() } placeholder="メッセージ"/>
                        <div className="input-msg-group-append">
                            <span onClick={ handleSubmit(onSubmit) } form="chatForm" class="input-msg-group-text">
                                <FontAwesomeIcon className="send-icon" icon={ faPaperPlane }/>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
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