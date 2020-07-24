'use strict';
// 墓地クラス
class Discard {
    constructor() {
        this._array = new Array();
    }
    push(cards) {
        this._array.push(cards);
    }

    pop() {//todo
        return this._array.pop();
    }
}



module.exports = Discard;