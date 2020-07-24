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
import StorySelection from './scripts/stage/story_selection';
import MasterHandSelection from './scripts/stage/master_hand_selection';
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
      <Progress socket={ socket }/>
      <Chat socket={ socket }/>
      <PlayerCounter socket={ socket }/>
      <Entry socket={ socket }/>
      <Start socket={ socket }/>
      {/* <canvas id="canvas-2d" width="10" height="10" style="object-fit:contain;"></canvas> /}
      {/ <img id="unko" src="images/unko.gif" style="display: none;"/>
      <img id="akira_with_Ginkakuji" src="images/akira_with_Ginkakuji.jpg" style="display: none;"/>
      <img id="akira_with_hood_and_Ginkakuji" src="images/akira_with_hood_and_Ginkakuji.jpg" style="display: none;"/> */}
      <MasterHandSelection socket={ socket } />
      <FieldSelection socket={ socket }/>
      <ShowAnswer socket={ socket }/>
      <ShowScore socket={ socket }/>
      <Result socket={ socket }/>
    </div>
  );
}

export default App;