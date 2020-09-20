import { data } from 'jquery';
import React, { useState, useEffect } from 'react';

export default function Matching(props) {

    /** マッチングの表示 */
    const [showMatching, setShowMatching] = useState(false);

    useEffect(() => {
        props.socket.on('update_player_list', (data) => {
            setShowMatching(true);
        });
        props.socket.on('hand_selection', () => setShowMatching(false));
    });

    return(
        <div class="text-center matching" style={ { display: showMatching ? 'block' : 'none' } }>
            <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                マッチング中...
            </button>
        </div>
    )
}