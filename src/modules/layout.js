'use struct'

class Layout {
    constructor(size) {
        this._array = new Array();
    }
    add(card) {
        this._array.push(card);
    }
    select(index) {
        this._array[index];
    }
}

module.exports = Layout;