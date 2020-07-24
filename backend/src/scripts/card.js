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
        this.player = null; // カードの持ち主が誰か
    }
    /** ステータス移行 */
    nextStatus() {
        this.statusIndex += 1;
        if(this.statusIndex === 4) {
            this.statusIndex = 0;
        }
        this.status = statusList[this.statusIndex];

    }
}

module.exports = Card;