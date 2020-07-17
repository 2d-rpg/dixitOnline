import React from 'react';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div class="container">
      <h1>Dixit Online</h1>
      <form class="form-inline" id="chatForm">
        <div class="form-group">
          <label for="msgForm">メッセージ：</label>
          <input type="text" class="form-control" id="msgForm"/>
        </div>
        <button type="submit" class="btn btn-primary">送信</button>
      </form>
      <div id="chatLogs"></div>
      <div id="numOfPeople">現在のプレイヤー人数：0人</div>
      <form class="form-inline" id="entryForm">
        <label class="sr-only" for="inlineFormInputName2">Name</label>
        <input type="text" class="form-control mb-2 mr-sm-2" id="userName" placeholder="名前を入力してください"/>
        <button type="submit" class="btn btn-primary mb-2">さんとしてゲームに参加</button>
      </form>
      {/* <button id="startButton" type="button" class="btn btn-warning" style="display: none;">スタート</button>
      <canvas id="canvas-2d" width="10" height="10" style="object-fit:contain;"></canvas> */}
      {/* <img id="unko" src="images/unko.gif" style="display: none;"/>
      <img id="akira_with_Ginkakuji" src="images/akira_with_Ginkakuji.jpg" style="display: none;"/>
      <img id="akira_with_hood_and_Ginkakuji" src="images/akira_with_hood_and_Ginkakuji.jpg" style="display: none;"/> */}
      <div id="progress"></div>
      <div id="theme"></div>
      <p id="hand"></p>
      <form class="form-inline" id="selected_hand_card_form">
        あなたが選んだカード:
        {/* <img id="selected_hand_card" width="200" height="200"/> */}
      </form> 
      <form class="form-inline" id="masterForm">
        <label for="claim">お題を入力してね：</label>
        <input type="text" class="form-control mb-2 mr-sm-2" id="masterClaim" placeholder="お題"/>
        <button type="submit" class="btn btn-primary mb-2">送信</button>
      </form>
    </div>
  );
}

export default App;


