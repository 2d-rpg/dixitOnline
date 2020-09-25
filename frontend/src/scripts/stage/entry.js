import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import '../../css/entry.css';

const REGEX = /( |　)+/g;

const audio = new Audio('../audio/decision29low.wav');
audio.volume = 0.1;

export default function Entry(props) {
    /** エントリーフォーム */
    const { register, handleSubmit, reset } = useForm();
    /** エントリーフォームの表示 */
    const [show, setShow] = useState(true);
    /** cookieの設定 */
    const [, setCookie] = useCookies(['client-id']);

    useEffect(() => {
        const comeback = (name) => {
            setShow(false);
            props.setName(name);
        };
        props.socket.on('room', () => setShow(false));
        props.socket.on('in_room', (data) => comeback(data.player.name));
        props.socket.on('hand_selection', (data) => comeback(data.player.name));
        props.socket.on('others_hand_selection', (data) => comeback(data.player.name));
        props.socket.on('field_selection', (data) => comeback(data.player.name));
        props.socket.on('show_answer', (data) => comeback(data.player.name));
        props.socket.on('result', (data) => comeback(data.player.name));
        // props.socket.on('restart', () => setShow(true));
    }, [ props.socket ]);

    /** エントリーフォーム入力時の動作 */
    const onSubmit = (data, event) => {
        if (data.username.length > 8 || data.username.match(REGEX) != null) { // 8文字以上か空白のみの場合
            reset();
            return;
        }
        audio.play();
        // サーバーに'entry'を送信
        setShow(false);
        setCookie('client-id', data.username, {path: '/'});
        // props.setShowStatus(true);
        props.setName(data.username);
        props.socket.emit('entry', {username : data.username});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        reset();
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }

    return (
        <div className="entry-wrapper" style={ {display: show ? 'block' : 'none' } }>
            <div className="entry-content">
                <div className="welcome-word">プレイヤー名を決めて参加しよう！</div>
                <form className="form-inline" id="entryForm" onSubmit={ handleSubmit(onSubmit) }>
                    <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" name="username" ref={ register() } placeholder="名前を入力してください" required/>
                    <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
                </form>
            </div>
        </div>
    );
}