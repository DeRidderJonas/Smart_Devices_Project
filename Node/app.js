var serialport = require('serialport');
var readline = require('readline');

var portname = process.argv[2];

var myPort = new serialport(portname,{
  bauttRate: 9600
})

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

myPort.on('open', onOpen);
myPort.on('data', onrecieveData);
myPort.on('error', showError);

rl.on('line', sendDataBluetooth);

function onOpen()
{
	console.log("Connection to Droid!");
}

function onrecieveData(data)
{
	console.log("Received data: " + data);
}

function sendDataBluetooth(data)
{
	console.log("Sending to Droid: " + data);
	myPort.write(data + "\n");
}

function showError(error)
{
   console.log('Serial port error: ' + error);
}
