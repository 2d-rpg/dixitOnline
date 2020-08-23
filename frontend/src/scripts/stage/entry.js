import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import '../../css/entry.css';

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
        props.socket.on('restart', () => setShow(true));
    }, [ props.socket ]);

    /** エントリーフォーム入力時の動作 */
    const onSubmit = (data, event) => {
        // サーバーに'entry'を送信
        setShow(false);
        setCookie('client-id', data.username, {path: '/'});
        props.setName(data.username);
        props.setShowStatus(true);
        props.socket.emit('entry', {username : data.username});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }

    return (
        <div className="entry-wrapper" style={ {display: show ? 'block' : 'none' } }>
            <div className="entry-content">
                <div className="welcome-word">プレイヤー名を決めて参加しよう！</div>
                <form className="form-inline" id="entryForm" onSubmit={ handleSubmit(onSubmit) }>
                    <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" name="username" ref={ register } placeholder="名前を入力してください"/>
                    <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
                </form>
            </div>
        </div>
    );
}