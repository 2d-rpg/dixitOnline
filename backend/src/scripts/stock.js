'use strict';
// 山場のクラス

const utils = require('./utils');
const Card = require('./card');

class Stock {
    constructor() {
        this._array = new Array();
        this.selectedIndex = null;
    }
    push(card) {
        this._array.push(card);
    }
    pop() {
        if (this._array.length > 0) {
            let card = this._array.pop();
            return card;
        } 
        else {
        // 墓地回収
            return null;
        }
    }
    shuffle() {
        this._array = utils.shuffle(this._array);
    }
}

module.exports = Stock;