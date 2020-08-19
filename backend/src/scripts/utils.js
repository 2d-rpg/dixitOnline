'use srtict';
const fs = require('fs');

/**
 * utils
 */

/** Logger for debug */
exports.log = (message) => {
    console.log('[debug] ' + message);
};

/** Stage logger for debug */
exports.logWithStage = (stage, message) => {
    console.log('[debug] [Stage: ' + stage + '] ' + message);
};

/** Uniform random sample image */
exports.randomSample = () => {
    const files = fs.readdirSync('../frontend/public/images/default/')
    var rand = Math.floor(Math.random() * files.length); // 0 to files.length-1
    return files[rand];
};

/** Fisher-Yates shuffle */
exports.shuffle = ([...array]) => {
    // var today = new Date();
    // var seed = Date.parse(today);
    var newArray = [];
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        newArray.push(array[j]);
        array.splice(j,1);
    }
    return newArray;
};


exports.uploadFile = (filename, image) => {
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer.from(data, 'base64');
    if (fs.readdirSync('../frontend/public/images/uploaded').indexOf(filename) == -1) {
        fs.writeFile('../frontend/public/images/uploaded/' + filename, buf, (err) => {
            if (err) {
                console.log('err');
            }
        });
    }
};