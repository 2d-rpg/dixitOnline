import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../card';
import $ from 'jquery';
import '../../../css/story_modal.css';

/** 空白のみの正規表現 */
const REGEX = /( |　)+/g;
/** ボタンの効果音 */
const audio = new Audio("../audio/draw.mp3");
/** ボタンの効果音の音量 */
audio.volume = 0.3;

/**
 * お題の入力フォームモーダル
 * @param {{ socket: SocketIO.Socket, setStory: (sotry: string) => void, masterIndex: number }} props 連想配列として，socket, setStory, masterIndexをもつ
 */
export default function StoryModal(props) {
    /** お題フォーム */
    const { register, handleSubmit, reset } = useForm();
    /** お題入力のエラーメッセージ */
    const [showErrMsg, setShowErrMsg] = useState(false);

    useEffect(() => {
        // モーダルの表示の中心をbodyではなく.game-coreに変更
        $('#exampleModalCenter').on('shown.bs.modal', () => {
            $('body').removeClass('modal-open');
            $('.game-core').addClass('modal-open');
        });
        $('#exampleModalCenter').on('hidden.bs.modal', () => {
            setShowErrMsg(false);
            $('.game-core').removeClass('modal-open');
        });

        /** サーバーからのemitを受け取るイベントハンドラ登録一覧 */
        props.socket.on('others_hand_selection', (data) => props.setStory(data.game.story));
        props.socket.on('field_selection', (data) => props.setStory(data.game.story));
        props.socket.on('show_answer', (data) => props.setStory(data.game.story));
        props.socket.on('result', (data) => props.setStory(data.game.story));

    }, [ props.socket, props.setStory, $('#exampleModalCenter') ]);

    /**
     * お題のフォーム送信ボタンを押したときの動作
     * @param {{ story: string }} data 連想配列として，sotryをもつ
     * @param {Event} event イベント
     */
    const onSubmit = (data, event) => {
        // 空白のみの入力は無効
        if (data.story.match(REGEX) != null) {
            setShowErrMsg(true);
            reset();
            return;
        }
        setShowErrMsg(false);
        $('#exampleModalCenter').modal('toggle');
        props.setStory(data.story);

        const card_x = $(`#eachHandButton${ props.masterIndex }`).offset().left;
        const field_x = ($(`#eachHandButton${ 2 }`).offset().left + $(`#eachHandButton${ 3 }`).offset().left) / 2;
        const move_y = - $(".game-core-wrapper").height() / 3;

        $(".toField").removeClass("toField");
        $(`#eachHandButton${ props.masterIndex }`).addClass("toField");
        document.getElementsByClassName("toField")[0].animate([
            // keyframes
            { transform: 'translateY(0px)'}, 
            { transform: `translate(${ field_x - card_x }px, ${ move_y }px)`, opacity: 0 },
        ], { 
            // timing options
            duration: 800
        });
        audio.play() // 再生
        setTimeout(
            () => props.socket.emit('story_selection', { message : data.story, masterIndex : props.masterIndex }), // サーバーに'story_selection'を送信
            800
        )
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        reset();
    };

    return(
        <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">お題を決めよう！</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <div className="modal-body">
                            <Card button={ props.src } kind={ 'selected' }/>
                            <form className="form-group" id="masterForm" onSubmit={ handleSubmit(onSubmit) }>
                                <span className="invalid-feedback" style={ {display: showErrMsg ? 'inline' : 'none'} }>入力されたお題は不適切です</span>
                                <label htmlFor="claim"></label>
                                <input type="text" className="form-control" id="masterClaim" name="story" ref={ register() } placeholder="お題" required/>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary m-auto" form="masterForm">決定</button>
                        </div>
                </div>
            </div>
        </div>
    );
}