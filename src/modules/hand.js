'use strict'
// 手札クラス

const Card = require('./card');

class Hand {
    constructor(size) {
        this._array = new Array(size).fill(new Card('/images/akira_with_Ginkakuji.jpg'));
    }
    select(index) {
        return this._array[index];
    }
    // 描画
    show() {
        this._array.forEach((value, index) => {
            var x = 400.0 / 3.0 + index * (Card.WIDTH + 400.0 / (3.0 * 5.0));
            var y = 600;
            value.draw(x, y);
        })
    }
}

module.exports = Hand;