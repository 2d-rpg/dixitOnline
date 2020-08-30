import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

export default function Room(props) {

    const { register, handleSubmit } = useForm();

    const [showRoom, setShowRoom] = useState(false);

    const [roomList, setRoomList] = useState(null);

    const [showRoomCreate, setShowRoomCreate] = useState(false);

    const [showRoomList, setShowRoomList] = useState(true);

    const updateRoomList = (roomManager) => {
        if (roomManager.roomList.length == 0) {
            setRoomList(
                <div>現在ルームは存在しませんm9(^Д^)</div>
            );
        } else {
            setRoomList(
                roomManager.roomList.map((room) => {
                    return(
                        <div className="room_list_content">
                            <div>{ room.name }</div>
                            <button className="btn btn-primary mb-2" onClick={ () => roomEntrySubmit(room.name)}>決定</button>
                        </div>
                    );
                })
            );
        }
    }

    const roomEntrySubmit = (roomname) => {
        setShowRoom(false);
        props.setShowStatus(true);
        props.socket.emit('room_entry', {roomname : roomname});
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }

    const roomCreateSubmit = (data, event) => {
        // サーバーに'entry'を送信
        setShowRoom(false);
        props.socket.emit('room_create', {username : data.username, roomname : data.roomname});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }

    const clickRoomCreate = () => {
        setShowRoomList(false);
        setShowRoomCreate(true);
    }

    const clickRoomList = () => {
        setShowRoomCreate(false);
        setShowRoomList(true);
    }

    useEffect(() => {
        props.socket.on('room', (data) => {
            updateRoomList(data.roomManager);
            setShowRoom(true);
        });
        props.socket.on('room_create', () => setShowRoom(false));
        props.socket.on('update_roomlist', (data) => updateRoomList(data.roomManager));
    });

    return(
        <div className="room" style={ {display: showRoom ? 'block' : 'none'} }>
            <div>
                <button onClick={ clickRoomCreate }>
                    ルームを新規作成
                </button>
                <button onClick={ clickRoomList }>
                    ルームに参加
                </button>
            </div>
            <div className="room-create" style={ {display: showRoomCreate ? 'block' : 'none'} }>
                <div className="room-create-title">ルーム名を決めてください</div>
                <form className="form-inline" id="roomCreateForm" onSubmit={ handleSubmit(roomCreateSubmit) }>
                    <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" name="roomname" ref={ register } placeholder="ルーム名"/>
                    <button type="submit" className="btn btn-primary mb-2">決定</button>
                </form>
            </div>
            <div className="room-list" style={ {display: showRoomList ? 'block' : 'none'} }>
                { roomList }
            </div>
        </div>
    );
}