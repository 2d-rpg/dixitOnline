import React from 'react';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerCounter from './scripts/playerCounter';
import Chat from './scripts/chat';
import Init from './scripts/stage/init';
import Entry from './scripts/stage/entry'
import Start from './scripts/stage/start';
import StorySelection from './scripts/stage/story_selection';
import MasterHandSelection from './scripts/stage/master_hand_selection';

function App() {
  return (
    <div className="container">
      <h1>Dixit Online</h1>
      <Init/>
      <Chat/>
      <PlayerCounter/>
      <Entry/>
      <Start/>
      {/* <canvas id="canvas-2d" width="10" height="10" style="object-fit:contain;"></canvas> */}
      {/* <img id="unko" src="images/unko.gif" style="display: none;"/>
      <img id="akira_with_Ginkakuji" src="images/akira_with_Ginkakuji.jpg" style="display: none;"/>
      <img id="akira_with_hood_and_Ginkakuji" src="images/akira_with_hood_and_Ginkakuji.jpg" style="display: none;"/> */}
      <MasterHandSelection/>
      <StorySelection/>
    </div>
  );
}

export default App;


