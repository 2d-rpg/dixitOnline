'use srtict';

/**
 * utils
 */

 /** Logger for debug */
 exports.log = function(message) {
     console.log('[debug] ' + message);
 }

 /** Stage logger for debug */
 exports.logWithStage = function(stage, message) {
     console.log('[debug] [Stage: ' + stage + '] ' + message);
 }

 /** Uniform random sample image */
 exports.randomSample = function(max) {
        var rand = Math.floor(Math.random() * max); // 0 to max-1
     // TODO: 現在3枚しかないのでこうしているが，大量のデータになると要修正
     if (rand < max / 3.0) {
         return "akira_with_Ginkakuji";
     } else if (rand < max * 2.0 / 3.0) {
         return "akira_with_hood_and_Ginkakuji";
     } else {
         return "unko";
     }
 }