/* bcbf
 * (B)ar(C)ode (B)rute (F)orce
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var async = require('async'),
    exec = require('child_process').exec;
    
    var HEADER = '(B)ar(C)ode (B)rute (F)orce';
    var MAX_BC = 999999999999;
    
    var mkbc = function(_code) {
        var code = Math.abs(_code).toString().replace('+', '').replace('e', ''),
            len = code.length;
        
        if(len < 12) {
            for(var i = 0; i<(12 - len); i++) {
                code = '0' + code;
            }
            
            return code;
        } else if(len === 12) {
            return code;
        } else {
            return '000000000000';
        }
    };
    
    var qPusher = function(q, start, chunk, until, updatePercent) {
        if(start < (until + 1)) {
            q.drain = function() {
                if(typeof updatePercent == 'function') {
                    updatePercent((start / until) * 100);
                }
                qPusher(q, start + chunk, chunk, until, updatePercent);
            };
            
            for(var i = 0; i<chunk; i++) {
                var iStart = (i + start);
                if(iStart < (until + 1)) {
                    q.push({
                        "i": (i + start)
                    }, function(err) {
                        if(err) {
                            console.error(err);
                        }
                    });
                }
            }
        } else {
            updatePercent(100);
        }
    };

    var tails = {
        svgz: function(fn) { //create a .svg.gz file (smallest size)
            return ' | gzip > \''+fn+'.svg.gz\'';
        },
        svg: function(fn) { //create a .svg file
            return ' > \''+fn+'.svg\'';
        },
        png: function(fn) { //create a .png file (largest size)
            return ' | convert -density 400 - '+fn+'.png';
        },
        svgpng: function(fn) { //create both a .svg file and a .png file
            return ' > \''+fn+'.svg\'; convert -density 400 '+fn+'.svg '+fn+'.png';
        }
    };
    
    var myTail = 'png';
    if(typeof process.argv[3] != 'undefined') {
        myTail = process.argv[3];
    }
    
    var tail = tails[myTail];
    
    var q = async.queue(function(task, cb) {
        var number = mkbc(task.i);
        exec(
            'zint --directsvg -d '+number+' -b 34' + tail(number),
        function(err, stdout, stderr) {
            cb(err);
        });
    }, 4);
    
    q.pc = 0; //percent done
    
    /*var q = async.queue(function(task, cb) {
        cb();
    }, 4); FOR TESTING */
    
    var bcToDo = 5;
    if(typeof process.argv[2] != 'undefined') {
        bcToDo = parseInt(process.argv[2], 10);
    }
    
    qPusher(q, 0, 8, bcToDo, function(pc) {
        q.pc = pc;
    });
    
    var update = function() {
        process.stdout.write('\u001B[2J\u001B[0;0f'); //cls
        console.log(HEADER);
        console.log(q.pc + '%');
        
        if(q.pc !== 100) {
            setTimeout(update, 1000);
        }
    }; update();