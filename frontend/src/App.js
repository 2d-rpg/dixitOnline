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
import socketIOClient from "socket.io-client";
import FieldSelection from './scripts/stage/field_selection';
import ShowAnswer from './scripts/stage/show_answer';
import ShowScore from './scripts/stage/show_score';
import Result from './scripts/stage/result';
const ENDPOINT = "http://127.0.0.1:4001/";
const socket = socketIOClient(ENDPOINT);

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

export default App;