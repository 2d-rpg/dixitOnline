'use strict'
// 手札クラス

const Card = require('./card');
const utils = require('./utils');

class Hand {
    constructor(size) {
        // 初期化(fill部分にnew Card()すると全て同一オブジェクトになるので一旦nullで埋める)
        this._array = new Array(size).fill(null);
        // ランダムサンプリング
        // TODO: このままでは復元抽出になってしまうので非復元抽出にするよう要修正
        for (var i=0; i < size; i++) { // forEach文だとエラーが出る
            this._array[i] = new Card(utils.randomSample(18));
        }
        //最後に選択されたカードのindex
        this.selectedIndex = 0;
    }
    select(index) {
        this.selectedIndex = index;
        //return this._array[index];
    }

    selectedCard(){
        return this._array[selectedIndex["index"]];
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