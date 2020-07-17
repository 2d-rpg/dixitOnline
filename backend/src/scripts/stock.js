'use strict';
// 山場のクラス

class Stock {
    constructor() {
        this._array = new Array();
    }
    push(card) {
        this._array.push(card);
    }
    pop() {
        if (this._array.length > 0) {
            return this._array.pop();
        }
        return null;
    }
}

module.exports = Stock;