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
    /** ユーザー入力エラー */
    const [ userAlert , setUserAlert] = useState("");

    useEffect(() => {
        const comeback = (name) => {
            setShow(false);
            props.setName(name);
        };
        const initializeName = (data) => {
            setUserAlert("");
            setShow(false);
            if (typeof data.player !== 'undefined') {
                setCookie('client-id', data.player.name, {path: '/'});
                props.setName(data.player.name);
            }
        };
        props.socket.on('room', (data) => initializeName(data));
        props.socket.on('in_room', (data) => comeback(data.player.name));
        props.socket.on('hand_selection', (data) => comeback(data.player.name));
        props.socket.on('others_hand_selection', (data) => comeback(data.player.name));
        props.socket.on('field_selection', (data) => comeback(data.player.name));
        props.socket.on('show_answer', (data) => comeback(data.player.name));
        props.socket.on('result', (data) => comeback(data.player.name));
        props.socket.on('username_duplication',() => setUserAlert("そのユーザー名は既に使用されています"));
        // props.socket.on('restart', () => setShow(true));
    }, [ props.socket ]);

    /** エントリーフォーム入力時の動作 */
    const onSubmit = (data, event) => {
        if (data.username.length > 8) { // 9文字以上の場合
            setUserAlert("ユーザー名が長すぎます(8文字以下にしてください)。");
            reset();
            return;
        } else if (data.username.match(REGEX) != null) { // 0文字の場合
            setUserAlert("空白のみの名前は無効です");
            reset();
            return;
        }
        audio.play();
        // サーバーに'entry'を送信
        // setShow(false);

        //setCookie('client-id', data.username, {path: '/'});
        // props.setShowStatus(true);
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
                    <div className="overlap" id="username-alert">{ userAlert }</div>
                </form>
            </div>
        </div>
    );
}