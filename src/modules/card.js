'use strict';
// カードクラス

// 静的プロパティ
const statusList = {
    0: 'stack',
    1: 'layout',
    2: 'discard'
};
// ゲーム画面の範囲
const FIELD_WIDTH = 1000, FIELD_HEIGHT = 800;
// カードの大きさ
const CARD_WIDTH = 100, CARD_HEIGHT = 150

class Card {
    constructor(filename) {
        this.status = statusList[0];
        this.filename = filename;
    }
    // カードの表示
    // 引数:位置 x, y
    draw(x, y) {
        let cv = document.createElement('canvas');
        let ct = cv.getContext('2d');
        ct.drawImage(this.filename, x, y);
    }
}

module.exports = Card;