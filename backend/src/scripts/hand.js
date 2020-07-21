'use strict'
// 手札クラス

const Card = require('./card');
const utils = require('./utils');

class Hand {
    constructor() {
        // 初期化(fill部分にnew Card()すると全て同一オブジェクトになるので一旦nullで埋める)
        this._array = new Array();
        
        //最後に選択されたカードのindex
        this.selectedIndex = null;
    }

    pop() {
        let card = this._array[this.selectedIndex];
        console.log('hand pop');
        console.log(this.selectedIndex)
        this._array.splice(this.selectedIndex, 1);
        return card
    }
    add(card) {
        this._array.push(card);
    }

    select(index) {
        this.selectedIndex = index;
    }

    selectedCard(){
        return this._array[selectedIndex];
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