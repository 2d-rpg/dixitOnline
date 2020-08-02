
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Upload(props) {
    /** エントリーフォーム */
    const { register, handleSubmit } = useForm();
    /** エントリーフォームの表示 */
    const [show, setShow] = useState(true);

    /** エントリーフォーム入力時の動作 */
    const onSubmit = (data, event) => {
        // サーバーに'entry'を送信
        const reader = new FileReader();
        reader.readAsDataURL(data.imageFile[0]);
        reader.onload = () => {
            props.socket.emit('upload', {filename: data.imageFile[0].name, image : reader.result});
        };
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    }

    return (
        <form className="form-inline" id="imageForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: show ? 'block' : 'none' } }>
            <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
            <input type="file" className="form-control mb-2 mr-sm-2" id="imageFile" name="imageFile" ref={ register }/>
            <button type="submit" className="btn btn-primary mb-2">画像をアップロード</button>
        </form>
    );
}