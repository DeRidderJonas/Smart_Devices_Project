const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const classes = require("./backend/classes");
const mazesFile = require("./backend/fileFunctions");
const serverSocket = require("./serverSocket");
const serialport = require('serialport');
const readline = require('readline');

const controllerPort = process.argv[2];
const displayPort = process.argv[3];

let reset = false;
let scores = [];
serverSocket.setHighscores(scores);

const ControllerSerialPort = new serialport(controllerPort, {
    bauttRate: 9600
});

const displayerSerialPort = new serialport(displayPort, {
    bauttRate: 9600
});

let rl = readline.createInterface({
     input : process.stdin,
     output : process.stdout
});

rl.on('line', onRecieveData);

ControllerSerialPort.on('open', onOpen);
ControllerSerialPort.on('data', onRecieveData);
ControllerSerialPort.on('error', showError);

displayerSerialPort.on('open', onOpen);
displayerSerialPort.on('error', showError);
//serial functions

function onOpen()
{
    console.log("Connection to Droid!");
}

function onRecieveData(data)
{
    console.log("Received data: " + data);
    //send direction
    let msgToSend;
    let cmd = parseInt(data);
    switch (cmd){
        case 2:
            msgToSend = "go up";
            movePlayerInServerSocket("up");
            break;
        case 1:
            msgToSend = "go left";
            movePlayerInServerSocket("left");
            break;
        case 0:
            msgToSend = "go down";
            movePlayerInServerSocket("down");
            break;
        case 3:
            msgToSend = "go right";
            movePlayerInServerSocket("right");
            break;
        case 4:
            msgToSend = "pause";
            if(serverSocket.wonGame || serverSocket.lostGame) {reset = true;}
            else serverSocket.pauseOrResumeMaze();
            break;
        case 5:
            msgToSend = "resume";
            if(serverSocket.wonGame || serverSocket.lostGame)reset = true;
            else serverSocket.pauseOrResumeMaze();
            break;
        default:
            msgToSend = "unknown command";
            break;
    }

    if((serverSocket.wonGame || serverSocket.lostGame) && reset){
        sendDataBluetooth("3");
        console.log("reseting maze");
        serverSocket.resetMaze();
        reset = false;
    }

    sendDataBluetooth(msgToSend)

}
let playedSound = false;
setInterval(function () {
    if(serverSocket.wonGame && !playedSound){
        sendDataBluetooth("1");
        console.log("game won, score: ", serverSocket.time);
        scores.push(serverSocket.time);
        serverSocket.insertHighscores();
        playedSound = true;
    }
    if(serverSocket.lostGame && !playedSound){
        sendDataBluetooth("2");
        console.log("game lost");
        playedSound = true;
    }
}, 500);

function sendDataBluetooth(data)
{
    console.log("Sending to displayer: " + data);
    displayerSerialPort.write(data);
}

function showError(error)
{
    console.log('Serial port error: ' + error);
}

// var index = require('./routes/index');
// var users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

app.get("/", function (req, res) {
   res.redirect("/maze/ArduinoMaze");
});

app.get("/maze/ArduinoMaze", function(req, res) {
    // mazesFile.GetMazeOrMakeNewMaze("ArduinoMaze", function () {
        res.render("doolhof.ejs", {mazeName: "ArduinoMaze", height : 16, width : 16});
    //})
});

//testing
function movePlayerInServerSocket(direction) {
    serverSocket.movePlayerFromSerial(direction);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
