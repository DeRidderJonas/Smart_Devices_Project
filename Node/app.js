var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var classes = require("./backend/classes");
var mazesFile = require("./backend/fileFunctions");
var serverSocket = require("./serverSocket");
var serialport = require('serialport');
var readline = require('readline');

// var portname = process.argv[2];
//
// var myPort = new serialport(portname, {
//     bauttRate : 9600
// });
//
// let r1 = readline().createInterface({
//     input : process.stdin,
//     output : process.stdout
// });
//
// myPort.on('open', onOpen);
// myPort.on('data', onRecieveData);
// myPort.on('error', showError);
//
// r1.on('line', sendDataBluetooth);

//serial functions

function onOpen()
{
    console.log("Connection to Droid!");
}

function onRecieveData(data)
{
    console.log("Received data: " + data);
    //send direction
}

function sendDataBluetooth(data)
{
    console.log("Sending to Droid: " + data);
    //myPort.write(data + "\n");
}

function showError(error)
{
    console.log('Serial port error: ' + error);
}

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

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
  var err = new Error('Not Found');
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
