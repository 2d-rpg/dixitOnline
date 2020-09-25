import React, { useEffect, useState } from 'react';
import '../css/story.css';

export default function Story(props) {

    const [showStory, setShowStory] = useState(false);

    useEffect(() => {
        props.socket.on('hand_selection', () => setShowStory(false));
        props.socket.on('others_hand_selection', () => setShowStory(true));
        props.socket.on('field_selection', () =>  setShowStory(true));
        props.socket.on('show_answer', () =>  setShowStory(true));
        props.socket.on('result', () => setShowStory(false));
        props.socket.on('in_room',() => setShowStory(false));

    }, [ props.socket ]);

    return(
        <div id="story" style={ {display: showStory ? 'block' : 'none'} }>
            <div className='story-title'>お題</div>
            <p>{ props.story }</p>
        </div>);
}