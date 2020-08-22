import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import $ from 'jquery';

const WIDTH = '100';
const HEIGHT = '150';

const REGEX = /( |　)+/g

export default function StoryModal(props) {
    /** お題フォーム */
    const { register, handleSubmit, reset } = useForm();
    /** お題入力のエラーメッセージ */
    const [showErrMsg, setShowErrMsg] = useState(false);

    // モーダルの表示の中心をbodyではなく.game-coreに変更
    $('#exampleModalCenter').on('shown.bs.modal', function (e) {
        $('body').removeClass('modal-open');
        $('.game-core').addClass('modal-open');
    });
    $('#exampleModalCenter').on('hidden.bs.modal', function (e) {
        setShowErrMsg(false);
        $('.game-core').removeClass('modal-open');
    });

    /** お題のフォーム送信ボタンを押したときの動作 */
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
        // サーバーに'story_selection'を送信
        props.socket.emit('story_selection', { message : data.story, masterIndex : props.masterIndex });
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
        reset();
    };

    return(
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">お題を決めよう！</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form className="form-inline" id="masterForm" onSubmit={ handleSubmit(onSubmit) }>
                        <div class="modal-body">
                            <div className="master-wrapper">
                                    <p className="selected-handcard-wrapper" id="selected-hand-card-wrapper">
                                        <img id="selected-hand-card" widht={ WIDTH } height={ HEIGHT } src={ props.src } alt="あなたが選んだカード"/> 
                                    </p> 
                                    <span className="invalid-feedback" style={ {display: showErrMsg ? 'inline' : 'none'} }>入力されたお題は不適切です</span>
                                    <label htmlFor="claim"></label>
                                    <input type="text" className="form-control mb-2 mr-sm-2" id="masterClaim" name="story" ref={ register() } placeholder="お題" required/>
                                    <button type="submit" className="btn btn-primary mb-2">決定</button>
                            </div>
                        </div>
                        {/* <div class="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">閉じる</button>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
}