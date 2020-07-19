import React, {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import { useForm } from 'react-hook-form';

export default function Entry() {
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        
    });

    return (
        <form className="form-inline" id="entryForm">
            <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
            <input type="text" className="form-control mb-2 mr-sm-2" id="userName" ref={ register } placeholder="名前を入力してください"/>
            <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
        </form>
    );
}