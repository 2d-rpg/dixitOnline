import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import Card from '../card';
import '../../css/show_answer.css';

export default function ShowAnswer(props) {
    /** モーダルのタイトル */
    const [message, setMessage] = useState(null);
    /** 全プレイヤーのスコア変化 */
    const [scoreDiffs, setScoreDiffs] = useState(null);
    /** フィールドの表示 */
    const [fieldCards, setFieldCards] = useState(false);
    /** フィールドを選んだプレイヤーの表示内容 */
    const [selectedNames, setSelectedNames] = useState(null);
    /** フィールドを選んだプレイヤーの表示内容 */
    const [ownerNames, setOwnerNames] = useState(null);

    // モーダルの表示の中心をbodyではなく.game-coreに変更
    $('#answerModal').on('shown.bs.modal', function (e) {
        $('body').removeClass('modal-open');
        $('.game-core').addClass('modal-open');
    });
    $('#answerModal').on('hidden.bs.modal', function (e) {
        $('.game-core').removeClass('modal-open');
        props.socket.emit('confirm_answer');
    });

    useEffect(() => {
        const iconStyle =  { 'margin-right': 20,'margin-left': 20 };

        /** モーダルの表示 */
        const open_modal = (data) => {
            // スコア変化の表示セット
            setScoreDiffs(
                data.game.players.sort((a, b) => { // 降順ソート
                    if( a.score > b.score ) return -1;
                    if( a.score < b.score ) return 1;
                    return 0;
                }).map((player, index) => {
                    var id_score_diff = 'eachScoreDiff' + index;
                    return(
                        <div className='eachScoreDiff' id={ id_score_diff }>
                            <span className="score-diff-name">{ player.name }</span>
                            <span>{ player.prescore }</span>
                            <FontAwesomeIcon className="role-figure" style={ iconStyle }  icon={ faLongArrowAltRight }/>
                            <span>{ player.score }</span>
                        </div>
                    );
                })
            );
            // フィールド上のカードが誰のカードだったのかの表示セット
            setOwnerNames(
                data.game.field.cards.map((card, index) => {
                    var id_lst = 'eachOwnerNames' + index;
                    const name = data.game.players.filter(player => 
                            player.socketId === card.player
                    ).map((player, indexplayer) => {
                        const id = "eachName" + index + "player" + indexplayer;
                        return (<div className={player.isMaster ? "eachOwnerName master" : "eachOwnerName"} id={ id }>{ player.name }</div>);
                    });
                    return (<div className="eachOwnerNames" id={ id_lst }>{ name }</div>);
                })
            );
            // 投票結果のフィールドの表示セット
            setFieldCards(
                data.game.field.cards.map((card, index) => {
                    var id_btn = 'eachFieldButton' + index;
                    var id_img = 'eachFieldImage' + index;
                    var field_src = "../images/" + card.filename;
                    const fieldButton = (
                        <p className='eachSelectedFieldButton' id={ id_btn }>
                            <img className='eachSelectedFieldImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                        </p>
                    );
                    return (<Card button={ fieldButton } kind={ 'answer' } isMaster={ index === data.game.field.masterCardIndex ? true : false }/>);
                })
            );
            // 投票結果の表示セット
            setSelectedNames(
                data.game.field.cards.map((card, index) => {
                    var id_lst = 'eachSelectedNames' + index;
                    const names = data.game.players.filter(player => 
                        data.game.answers.filter(element => element.cardIndex === index).some(element => element.id === player.socketId)
                    ).map((player, indexplayer) => {
                        const id = "eachName" + index + "player" + indexplayer;
                        return (<div className="eachName" id={ id }>{ player.name }</div>);
                    });
                    return (<div className="eachSelectedNames" id={ id_lst }>{ names }</div>);
                })
            );
            setMessage( data.player.score - data.player.prescore === 0 ? '残念！' : 'やったね！' );
            $('#answerModal').modal('toggle');
        };
        /** サーバからのemitされたときのイベントハンドラ一覧 */
        props.socket.on('show_answer' ,(data) => open_modal(data));

    }, [ props.socket, message, scoreDiffs ]);

    const handleclick = () => {
        $('#answerModal').modal('toggle');
    }

    return(
        <div className="modal fade" id="answerModal" tabindex="-1" role="dialog" aria-labelledby="answerModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="answerModalTitle">今回の結果は．．．</h5>
                        <button type="button" class="close" onClick={ handleclick } aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='answer-wrapper' id="answer">
                            { message }
                            <div className="show-answer-selected-cards">
                                <div className="field-result-wrapper">
                                    <p>投票結果</p>
                                    <div id="owner-field">{ ownerNames }</div>
                                    <div className="field-cards-result">{ fieldCards }</div>
                                    <div id="selected-field">{ selectedNames }</div>
                                </div>
                            </div>
                            <div className="score-diff">
                                { scoreDiffs }
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button id="backButton" onClick={ handleclick } type="button" className="btn btn-warning m-auto">OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
}