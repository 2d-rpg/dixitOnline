import React, {useState, useEffect} from 'react';

export default function Progress(props) {

    const [message, setMassage] = useState('ようこそ！');
    // 文章を集約
    const cannot_play = '現在プレイ中です しばらくお待ちください';
    const waiting_entry = '他のプレイヤーが参加するのを待っています...';
    // const master_hand_selection = 'あなたは語り部です カードを選択してください';
    // const waiting_master_hand_selection = '現在語り部がカードとお題を考え中です しばらくお待ちください';
    // const story_selection = '選択したカードのお題を入力して下さい';
    const others_hand_selection = 'お題に沿ったカードを選択してください';
    // const waiting_others_selection = "他のユーザーのカード選択を待っています";
    // const others_filed_selection = 'お題に沿ったカードを手札から選んで下さい';
    // const waiting_filed_selection = '他のプレイヤーがフィールドから選択中です しばらくお待ちください...';
    
    useEffect(() => {
        props.socket.on('cannot_play' ,(data) => setMassage(cannot_play));
        props.socket.on('start' ,(data) => setMassage(waiting_entry));
        // props.socket.on('entry' ,(data) => setMassage());
        props.socket.on('hand_selection' ,() => setMassage());
        props.socket.on('others_hand_selection' ,() => setMassage(others_hand_selection));
    });

    return (
        <div id="progress">
            <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title={message}>
                fefef
            </button>
        </div>
    );
}