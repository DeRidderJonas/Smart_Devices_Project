/**
 * Created by micha on 21/03/2018.
 */
const io = require('socket.io');
const classes = require("./backend/classes");
const mazeFile = require("./backend/fileFunctions");


let moduleServerSocket = function () {
    let socketConnected = 0;
    const serverSocket = io();
    let mazeBeingEdited;
    this.wonGame = false;
    this.lostGame = false;

    serverSocket.on("connection", function (socket) {
        socketConnected++;
        console.log("Connection received");

        socket.on("joinMaze", function (mazeName) {
            mazeFile.GetMazeData(mazeName, function (mazeJSON) {
                if (mazeJSON != null) {
                    mazeBeingEdited = classes.ConvertJsonToMaze(mazeJSON);

                    socket.emit("updateMazeData",
                        {
                            cells: mazeBeingEdited.cells,
                            beginPoint: mazeBeingEdited.beginPoint,
                            endPoint: mazeBeingEdited.endPoint
                        });
                    socket.emit("updatePlayerData",
                        {
                            previousX: mazeBeingEdited.beginPoint.x,
                            previousY: mazeBeingEdited.beginPoint.y,
                            newX: mazeBeingEdited.player.x,
                            newY: mazeBeingEdited.player.y
                        })

                } else {
                    socket.emit("Error", "no Maze Found");
                }
            });
        });

        socket.on("movePlayer", function (directionString) {
            let direction = parseDirection(directionString);
            let player = mazeBeingEdited.player;

            let jsonToSend = mazeBeingEdited.updateMaze(player, direction);
            serverSocket.sockets.emit("updatePlayerData", jsonToSend);
        });

        socket.on("disconnect", function () {
            socketConnected--;
            console.log("disconnected. Number of connections remaining: " + socketConnected);
            if (socketConnected <= 0 && mazeBeingEdited != null) {
                mazeFile.SaveMaze(mazeBeingEdited, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        mazeBeingEdited = null;
                        console.log("all disconnected, maze is saved");
                    }
                });
            } else {
                console.log("nothing happend");
            }
        });
    });

    function parseDirection(dirAsString) {
        return classes.Directions.find(d => d.name == dirAsString);
    }


    function movePlayerFromSerial(directionString) {
        let direction = parseDirection(directionString);
        let player = mazeBeingEdited.player;

        console.log(direction);

        let jsonToSend = mazeBeingEdited.updateMaze(player, direction);
        this.wonGame = jsonToSend.won;
        serverSocket.sockets.emit("updatePlayerData", jsonToSend);
    }

    return {
        serverSocket: serverSocket,
        movePlayerFromSerial: movePlayerFromSerial,
        wonGame: this.wonGame,
        lostGame: this.lostGame
    }
}();


module.exports = moduleServerSocket;
