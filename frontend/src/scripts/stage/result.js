import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import '../../css/result.css';

export default function Result(props) {
    /** 結果の内容 */
    const [result, setResult] = useState(null);

    // モーダルの表示の中心をbodyではなく.game-coreに変更
    $('#resultModal').on('shown.bs.modal', function (e) {
        $('body').removeClass('modal-open');
        $('.game-core').addClass('modal-open');
    });
    $('#resultModal').on('hidden.bs.modal', function (e) {
        $('.game-core').removeClass('modal-open');
        props.socket.emit('restart');
    });

    useEffect(() => {
        /** result画面の表示 */
        const show_result = (data) => {
            props.setMessage('結果発表ですわぁ(⌒,_ゝ⌒)');
            setResult(
                data.game.players.sort((a, b) => { // 降順ソート
                    if( a.score > b.score ) return -1;
                    if( a.score < b.score ) return 1;
                    return 0;
                }).map((player, index) => {
                    var id_result = 'eachResult' + index;
                    return(
                        <tr className='eachResult' id={ id_result }>
                            <td>{ player.name }</td>
                            <td>{ player.score }</td>
                        </tr>
                    );
                })
            );
            $('#resultModal').modal('toggle');
        }

        props.socket.on('result' ,(data) => show_result(data));
    }, [ props ]);

    return(
        <div id="result-wrapper">
        <div className="modal fade" id="resultModal" tabindex="-1" role="dialog" aria-labelledby="resultModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" id="resultModalDialog" role="document">
                <div clasName="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="resultModalTitle">結果</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <table id="result-table">
                            <tbody id="result">
                                { result }
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button id="backButton" type="button" className="btn btn-warning" data-dismiss="modal">戻る</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}