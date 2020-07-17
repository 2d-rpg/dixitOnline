'use strict';
// カードクラス

// 静的プロパティ
const statusList = ['stack','hand','field','discard'];
// ゲーム画面の範囲
const FIELD_WIDTH = 1000, FIELD_HEIGHT = 800;

class Card {
    // カードの大きさ
    static CARD_WIDTH = 100;
    static CARD_HEIGHT = 150;

    constructor(filename) {
        // デバッグ用
        this.status = statusList[0]; // どこにあるか
        this.statusIndex = 0;
        // image file name
        this.filename = filename;
        this.head = false; // 表かどうか
    }
    /** ステータス移行 */
    nextStatus() {
        this.statusIndex += 1;
        this.status = statusList[this.statusIndex];
    }
    /** 
     * カードの表示
     * @param x 位置x (横方向, 左原点)
     * @param y 位置y (縦方向, 上原点)
     **/
    draw(x, y) {
        let cv = document.createElement('canvas');
        let ct = cv.getContext('2d');
        ct.drawImage(this.filename, x, y);
    }
}

module.exports = Card;