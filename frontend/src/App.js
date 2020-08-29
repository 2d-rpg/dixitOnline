import React, {useState} from 'react';
import './App.css';
import './css/game.css';
import './css/progress.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import PlayerCounter from './scripts/playerCounter';
import Chat from './scripts/chat';
import Story from './scripts/story';
import Init from './scripts/stage/init';
import Entry from './scripts/stage/entry';
import Start from './scripts/stage/start';
import HandSelection from './scripts/stage/hand_selection';
import { withCookies } from 'react-cookie';
import io from 'socket.io-client';
import FieldSelection from './scripts/stage/field_selection';
import ShowAnswer from './scripts/stage/show_answer';
import ShowRole from './scripts/stage/show_role';
import Result from './scripts/stage/result';
import Upload from './scripts/upload';
import $ from 'jquery';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import Status from './scripts/status';
import PlayerList from './scripts/player_list';


// const ENDPOINT = "http://34.83.112.24:3000/";
const ENDPOINT = "localhost:4001/";
// const socket = socketIOClient(ENDPOINT);
const socket = io(ENDPOINT, {
  query: { 'client-id': cookieVal('client-id') },
  transports: ['websocket'],
  upgrade: false
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

console.log(socket.io.opts.query);
console.log(document.cookie);
socket.on('connect_timeout', () => console.log('timeout'));
socket.on('reconnect', (num) => console.log('reconnect: ' + num));
socket.on('reconnect_attempt', (num) => console.log('reconnect_attempt: ' + num));
socket.on('reconnecting', (num) => console.log('reconnecting: ' + num));
socket.on('reconnect_error', (error) => console.log('reconnect_error: ' + error));
socket.on('reconnect_failed', () => console.log('reconnect_failed'));
socket.on('connect_error', (error) => console.log('connect_error: ' + error));

function App() {
  /** help */
  const [message, setMessage] = useState('ようこそ！');
  /** お題の内容 */
  const [story, setStory] = useState('');
  /** プレイヤー名 */
  const [name, setName] = useState(null);
  /** ステータス(プレイヤー名とスコア)の表示 */
  const [showStatus, setShowStatus] = useState(false);

  return (
    <div className="container">
      <div className='header'>
        <h1>Dixit Online</h1>
      </div>
      <div className="game-container">
        <div className='game-core-wrapper'>
          <div className='game-core'>
            <Init socket={ socket }/>
            <div id="progress">
              <div className="help">
                <FontAwesomeIcon icon={faQuestion} />
              </div>
              <div className="help-content">
                { message }
              </div>
            </div>
            <Entry socket={ socket } setMessage={ setMessage } setName={ setName } setShowStatus={ setShowStatus }/>
            <Start socket={ socket } setMessage={ setMessage }/>
            <Story socket={ socket } story={ story }/>
            <HandSelection socket={ socket } setMessage={ setMessage } setStory={ setStory }/>
            <FieldSelection socket={ socket } setMessage={ setMessage }/>
            <ShowAnswer socket={ socket } setMessage={ setMessage }/>
            <Result socket={ socket } setMessage={ setMessage }/>
            <Status socket={ socket } name={ name } showStatus={ showStatus } setShowStatus={ setShowStatus }/>
            <PlayerList socket={ socket } name={ name }/>
            <ShowRole socket={ socket } setMessage={ setMessage } />
            <Upload socket={ socket }/>
          </div>
        </div>
        <div className="game-chat">
          <PlayerCounter socket={ socket }/>
          <Chat socket={ socket }/>
        </div>
      </div>
    </div>
  );
}

function cookieVal(key){
  return ((document.cookie + ';').match(key + '=([^¥S;]*)')||[])[1];
}

export default withCookies(App);