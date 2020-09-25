import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Leave from '../leave';
import '../../css/room.css';


const audio = new Audio('../audio/decision29low.wav');
audio.volume = 0.1;

export default function Room(props) {

    const { register, handleSubmit } = useForm();

    const [showRoom, setShowRoom] = useState(false);

    const [showRoomContent, setShowRoomContent] = useState(true);

    const [roomList, setRoomList] = useState(null);

    const [showRoomCreate, setShowRoomCreate] = useState(false);

    const [showRoomList, setShowRoomList] = useState(true);

    const [showStart, setShowStart] = useState(false);

    const [option,setOption] = useState(false);

    const roomEntrySubmit = (roomname) => {
        audio.play();
        setShowRoom(false);
        props.setShowStatus(true);
        props.socket.emit('room_entry', {roomname : roomname});
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }

    const roomCreateSubmit = (data, event) => {
        // サーバーに'entry'を送信
        audio.play();
        setShowRoomContent(false);
        props.setShowStatus(true);
        props.socket.emit('room_create', {username : data.username, roomname : data.roomname});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        props.setMessage('他のプレイヤーが参加するのを待っています( ´ ▽ ` )');
    }

    const clickRoomCreate = () => {
        audio.play();
        setShowRoomList(false);
        setShowRoomCreate(true);
    }

    const clickRoomList = () => {
        audio.play();
        setShowRoomCreate(false);
        setShowRoomList(true);
    }

    const clickStart = () => {
        audio.play();
        props.socket.emit('start', {option: option});
        setShowStart(false);
    }

    useEffect(() => {
        const updateRoomList = (roomManager) => {
            if (roomManager.roomList.length === 0 || roomManager.roomList.filter(room => room.game.stageIndex === 0).length === 0) {
                setRoomList(
                    <div>現在ルームは存在しません m9(^Д^)</div>
                );
            } else {
                setRoomList(
                    roomManager.roomList.filter(room => room.game.stageIndex === 0).map((room) => {
                        return(
                            <div className="room-list-content">
                                <div className="room-name">{ room.name }</div>
                                <div className="room-decision-button">
                                    <button className="btn btn-primary mb-2" onClick={ () => roomEntrySubmit(room.name)}>入室</button>
                                </div>
                            </div>
                        );
                    })
                );
            }
        }

        props.socket.on('room', (data) => {
            updateRoomList(data.roomManager);
            setShowRoomContent(true);
            setShowRoom(true);
        });
        props.socket.on('in_room', (data) => {
            setShowRoomContent(false);
            setShowRoom(true);
            if (data.others.length >= 2 && data.player.isMaster) setShowStart(true);
        });
        // props.socket.on('room_create', () => setShowRoom(false));
        props.socket.on('update_roomlist', (data) => updateRoomList(data.roomManager));
        props.socket.on('entry_player', (data) => {
            if (data.room.game.players.length >= 3 && data.room.game.players[0].socketId === props.socket.id) {
                setShowRoom(true);
                setShowRoomContent(false);
                setShowStart(true);
            }
        });
        props.socket.on('restart', () => {
            setShowRoomContent(false);
            setShowRoomCreate(false);
            setShowRoomList(false);
            setShowRoom(true);
        });
    }, [ props.socket, setShowRoom, setRoomList ]);

    return(
        <div className="room" style={ {display: showRoom ? 'block' : 'none'} }>
            <div className="room-content" style={ {display: showRoomContent ? 'block' : 'none'} }>
                <div className="room-button">
                    <button onClick={ clickRoomCreate } id="create-room-button" className="btn btn-primary mb-2">
                        ルームを新規作成
                    </button>
                    <button onClick={ clickRoomList } id="join-room-button" className="btn btn-primary mb-2">
                        既存ルームに参加
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
            <div className="game-start" style={ {display: showStart ? 'block' : 'none'} }>
                <div className="deck-select">
                    <input type="radio" id="default" name="deck" value="default" checked={!option}/>
                    <label className="deck-select-content" onClick={() => setOption(false)} for='default'>
                        デフォルトデッキ
                    </label>
                    <input type="radio" id="option" name="deck" value="option" checked={option}/>
                    <label className="deck-select-content" onClick={() => setOption(true)} for='option'>
                        みんなの寄せ集め<br/>（みんなが投稿した　<br/>　画像でデッキを作成）
                    </label>
                </div>
                <button onClick={ () => clickStart() } className="btn btn-primary mb-2">
                    このメンバーでゲーム開始
                </button>
            </div>
            <Leave className="room-leave" socket= { props.socket }/>
        </div>
    );
}