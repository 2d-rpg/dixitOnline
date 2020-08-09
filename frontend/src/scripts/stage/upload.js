import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import '../../css/upload.css';

export default function Upload(props) {
    /** エントリーフォーム */
    const { upload, handleSubmit } = useForm();
    /** エントリーフォームの表示 */
    const [show, setShowForm] = useState(true);
    /** cookieの設定 */
    const [, setCookie] = useCookies(['client-id']);

    useEffect(() => {
        props.socket.on('start', () => setShowForm(false));
        // props.socket.on('hand_selection', () => setShow(false));
        // props.socket.on('field_selection', () => setShow(false));
        // props.socket.on('show_answer', () => setShow(false));
        // props.socket.on('show_score', () => setShow(false));
        // props.socket.on('result', () => setShow(false));
    }, [ props.socket, setShowForm ]);

    /** エントリーフォーム入力時の動作 */
    const onSubmit = (data, event) => {
        // サーバーに'entry'を送信
        setShowForm(false);
        setCookie('client-id', data.username, {path: '/'});
        props.socket.emit('entry', {username : data.username});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    }

    return (
        <form className="form-inline" id="uploadForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: show ? 'block' : 'none' } }>
            <label className="sr-only" htmlFor="inlineFormInputName2">
                Image
            </label>
            <input type="file" className="form-control mb-2 mr-sm-2" id="uploadImage" name="image" ref={ upload } />
            <button type="submit" className="btn btn-primary mb-2">画像をアップロード</button>
        </form>
    );
}