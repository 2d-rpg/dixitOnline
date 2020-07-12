
import {Utils} from './utils.js'
const startButton = document.getElementById('startButton');

export class Start {

    static do() {
        Utils.clearDisplay();
        startButton.style.display = 'block';
        console.log('[debug] スタート待機状態');
    }
}