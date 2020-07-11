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