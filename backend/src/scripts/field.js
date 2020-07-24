'use strict';

class Field {
    constructor() {
        this.cards = new Array();
        this.masterCard = null;
    }
    add(card) {
        card.nextStatus();
        if(card.player.isMaster){
            this.masterCard = card;
        }
        this.cards.push(card);
        shuffle(this.cards);
    }
    new(){
        this.cards.splice(0);
    }
    masterCardIndex(){
        return this.cards[this.masterCard];
    }
}

module.exports = Field;