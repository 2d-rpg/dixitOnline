import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import '../css/progress.css';

export default function Help(props) {

    return (
        <div id="progress">
            <div className="help"><FontAwesomeIcon icon={faQuestion} /></div>
            <div className="help-content">{ props.message }</div>
            <div className="help-content-triangle"></div>
        </div>
    );
}