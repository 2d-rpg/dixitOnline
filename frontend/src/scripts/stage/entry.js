import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

export default function Entry(props) {
    /** エントリーフォーム */
    const { register, handleSubmit } = useForm();
    /** エントリーフォームの表示 */
    const [show, setShow] = useState(true);
    /** cookieの設定 */
    const [, setCookie] = useCookies(['client-id']);

    useEffect(() => {
        props.socket.on('start', () => setShow(false));
        props.socket.on('hand_selection', () => setShow(false));
        props.socket.on('field_selection', () => setShow(false));
        props.socket.on('show_answer', () => setShow(false));
        props.socket.on('show_score', () => setShow(false));
        props.socket.on('result', () => setShow(false));
        props.socket.on('restart', () => setShow(true));
    }, [ props.socket ]);

    /** エントリーフォーム入力時の動作 */
    const onSubmit = (data, event) => {
        // サーバーに'entry'を送信
        setShow(false);
        setCookie('client-id', data.username, {path: '/'});
        props.socket.emit('entry', {username : data.username});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }

    return (
        <form className="form-inline" id="entryForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: show ? 'block' : 'none' } }>
            <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
            <input type="text" className="form-control mb-2 mr-sm-2" id="userName" name="username" ref={ register } placeholder="名前を入力してください"/>
            <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
        </form>
    );
}