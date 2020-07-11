'use strict';
// 墓地クラス
class Discard {
    constructor() {
        this._array = new Array();
    }
    push(cards) {
        this._array.push(cards);
    }
}

module.exports = Discard;