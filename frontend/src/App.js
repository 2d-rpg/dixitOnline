import React from 'react';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerCounter from './scripts/playerCounter';
import Progress from './scripts/progress';
import Chat from './scripts/chat';
import Init from './scripts/stage/init';
import Entry from './scripts/stage/entry'
import Start from './scripts/stage/start';
import HandSelection from './scripts/stage/hand_selection';
// import socketIOClient from "socket.io-client";
import { withCookies } from 'react-cookie';
import io from 'socket.io-client';
import FieldSelection from './scripts/stage/field_selection';
import ShowAnswer from './scripts/stage/show_answer';
import ShowScore from './scripts/stage/show_score';
import Result from './scripts/stage/result';
const ENDPOINT = "http://127.0.0.1:4001/";
// const socket = socketIOClient(ENDPOINT);
const socket = io(ENDPOINT, {
  query: { 'client-id': cookieVal('client-id') },
  transports: ['websocket'],
  upgrade: false
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

  return (
    <div className="container">
      <h1>Dixit Online</h1>
      <Init socket={ socket }/>
      <Chat socket={ socket }/>
      <PlayerCounter socket={ socket }/>
      <Progress socket={ socket }/>
      <Entry socket={ socket }/>
      <Start socket={ socket }/>
      <HandSelection socket={ socket } />
      <FieldSelection socket={ socket }/>
      <ShowAnswer socket={ socket }/>
      <ShowScore socket={ socket }/>
      <Result socket={ socket }/>
    </div>
  );
}

function cookieVal(key){
  return ((document.cookie + ';').match(key + '=([^¥S;]*)')||[])[1];
}

export default withCookies(App);