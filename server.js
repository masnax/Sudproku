var express = require('express');
var { exec } = require('child_process');
var app = express();
var sudokus = {
    problems:Array(4).fill(),
    solutions: {
        r:Array(4).fill(), 
        h:Array(4).fill(), 
        x:Array(4).fill(),
    }
}

function runSwipl(arg, callback) {
    exec('swipl sudproku.pl ' + arg + " | sed -e \"s/_/-1/g\"", (err, stdout) => {
        if (err) {
            console.error(err)
            return;
        }
        callback(stdout);
    })
}

function getPrologOutput() {
    //order: [P0, P1, P2, P3, SR0-3, SH0-3, SX0-3]

    for(let i = 0; i <= 3; i++) {
        runSwipl(i, (stdout) => {
            sudokus.problems[i] = stdout;
        });
    }
    for(let i = 0; i <= 3; i++) {
            runSwipl(i + " r", (stdout) => {
                sudokus.solutions.r[i] = stdout;
            });
            runSwipl(i + " h", (stdout) => {
                sudokus.solutions.h[i] = stdout;
            });
            runSwipl(i + " x", (stdout) => {
                sudokus.solutions.x[i] = stdout;
            });
        }
    }

function spawn() {
    app.use(express.static(__dirname + "/UI", {index: 'sudproku.html'}));
    var server = app.listen(8181);
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        socket.on('prolog', function (callback) {
            callback(sudokus);
        });
    });
}
getPrologOutput();
spawn();
