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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


exports.uploadFile = (filename, image, playername) => {
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer.from(data, 'base64');
    const dir = '../frontend/public/images/uploaded/';
    fs.mkdirSync(dir + playername + '/', { recursive: true }, (err)=>{
        if (err) throw err;
    });// recursiveは既に存在していてもerrorを吐かない
    if (fs.readdirSync(dir + playername).indexOf(filename) == -1) {
        fs.writeFileSync(dir + playername + '/' + filename, buf, (err) => {
            if (err) {
                console.log('err');
            }
        });
    }
    // ファイルの削除
    const MAX_FILE = 20; // 1プレイヤー20まで
    const files = fs.readdirSync(dir + playername);
    if (files.length > MAX_FILE) {
        const sortedFiles = files.sort((a, b) => { // ファイルを新しい順にソート
            const aStat = fs.statSync(dir + playername + '/' + a).ctime;
            const bStat = fs.statSync(dir + playername + '/' + b).ctime;
            if( aStat > bStat ) return -1;
            if( aStat < bStat ) return 1;
            return 0;
        });
        sortedFiles.slice(MAX_FILE).forEach(file => fs.unlinkSync(dir + playername + '/' + file)); // 古いファイルは削除
    }
};