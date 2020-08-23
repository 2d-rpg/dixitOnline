import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import Card from '../card';
import '../../css/show_answer.css';

export default function ShowAnswer(props) {
    /** 答えのソース */
    const [answerSrc, setAnswerSrc] = useState('');
    /** スコア情報(previous, new, diff) */
    const [scoreInfo, setScoreInfo] = useState({ previous:0, new: 0, diff: 0});
    /** モーダルのタイトル */
    const [message, setMessage] = useState(null);
    /** 全プレイヤーのスコア変化 */
    const [scoreDiffs, setScoreDiffs] = useState(null);

    const iconStyle =  { 'margin-right': 20,'margin-left': 20 };

    // モーダルの表示の中心をbodyではなく.game-coreに変更
    $('#answerModal').on('shown.bs.modal', function (e) {
        $('body').removeClass('modal-open');
        $('.game-core').addClass('modal-open');
    });
    $('#answerModal').on('hidden.bs.modal', function (e) {
        $('.game-core').removeClass('modal-open');
    });

    useEffect(() => {
        /** 答えのセットとスコアの計算をサーバに依頼 */
        const show_answer = (data) => {
            let filename = data.game.field.masterCard.filename;
            const src = "../images/default/" + filename;
            setAnswerSrc(
                <p className='answerButton'>
                    <img className='answerImage' src={ src } alt={ filename }></img>
                </p>
            );
            props.socket.emit('calc_score');
        }
        /** モーダルの表示 */
        const open_modal = (data) => {
            setScoreInfo({ previous: data.previous, new: data.new, diff: data.diff });
            setMessage( data.diff === 0 ? '残念！' : 'やったね！' );
            $('#answerModal').modal('toggle');
        };
        /** サーバからのemitされたときのイベントハンドラ一覧 */
        props.socket.on('show_answer' ,(data) => show_answer(data));
        props.socket.on('score_diff', (data) => open_modal(data));

    }, [ props.socket ]);

    const handleclick = () => {
        props.socket.emit('confirm_answer');
    }

    return(
        <div className="modal fade" id="answerModal" tabindex="-1" role="dialog" aria-labelledby="answerModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="answerModalTitle"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='answer-wrapper' id="answer">
                            { message }
                            <div className="show-answer-selected-cards">
                                <div className="answer-card-wrapper">
                                    <p>正解</p>
                                    <Card button={ answerSrc } kind={ 'Answer' }/>
                                </div>
                                <div className="field-result-wrapper">
                                    <p>フィールド選択の最終結果をここに表示(TODO)</p>
                                </div>
                            </div>
                            <div className="score-diff">
                                <span>{ scoreInfo.previous }</span>
                                <FontAwesomeIcon className="role-figure" style={ iconStyle }  icon={ faLongArrowAltRight }/>
                                <span>{ scoreInfo.new }</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button id="backButton" onClick={ handleclick } type="button" className="btn btn-warning" data-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
}