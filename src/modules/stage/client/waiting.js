
import {Utils} from './utils.js'
const startButton = document.getElementById('startButton');

export class Waiting {

    static do() {
        Utils.clearDisplay();
        startButton.style.display = 'block';
        console.log('[debug] waiting状態');
    }
}