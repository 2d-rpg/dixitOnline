'use strict';
// 山場のクラス

const utils = require('./utils');
const Card = require('./card');

class Stock {
    constructor(size) {
        // 初期化(fill部分にnew Card()すると全て同一オブジェクトになるので一旦nullで埋める)
        this._array = new Array(size).fill(null);
        // ランダムサンプリング
        // TODO: このままでは復元抽出になってしまうので非復元抽出にするよう要修正
        for (var i=0; i < size; i++) { // forEach文だとエラーが出る
            this._array[i] = new Card(utils.randomSample(size));
        }
    }
    push(card) {
        this._array.push(card);
    }
    pop() {
        if (this._array.length > 0) {
            return this._array.pop();
        } 
        // else {
        // // 墓地回収
        //     ;

        // }
        return null;
    }
}

module.exports = Stock;