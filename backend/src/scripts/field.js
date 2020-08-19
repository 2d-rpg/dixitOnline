'use strict';

const utils = require('./utils');

class Field {
    constructor(size) {
        this.cards = new Array();
        this.masterCard = null;
    }
    /** フィールドにカードを追加 */
    add(card, game) {
        card.nextStatus();
        if(game.findPlayer(card.player).isMaster){
            this.masterCard = card;
        }
        this.cards.push(card);
    }
    /** フィールドからカードを削除 */
    pop() {
        return this.cards.pop();
    }
    /** フィールドのカードをシャッフル */
    shuffle() {
        this.cards = utils.shuffle(this.cards);
    }
    new(){
        this.cards.splice(0);
    }
    masterCardIndex(){
        return this.cards[this.masterCard];
    }
}

module.exports = Field;