import React, { useEffect, useState } from 'react';
import '../css/story.css';

export default function Story(props) {

    const [showStory, setShowStory] = useState(false);

    useEffect(() => {
        props.socket.on('hand_selection', () => setShowStory(false));
        props.socket.on('others_hand_selection', () => setShowStory(true));
        props.socket.on('result', () => setShowStory(false));
    });

    return(
        <div id="story" style={ {display: showStory ? 'block' : 'none'} }>
            <div className='story-title'>お題</div>
            <p>{ props.story }</p>
        </div>);
}