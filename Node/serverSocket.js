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
    this.time = 0;
    this.lostGame = false;

    serverSocket.on("connection", function (socket) {
        socketConnected++;
        console.log("Connection received");

        socket.on("joinMaze", function (mazeData) {
            mazeFile.createNewMaze(mazeData.mazeName, mazeData.cols, mazeData.rows, function (maze) {
                mazeBeingEdited = maze;
                if (maze != null) {
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

        socket.on("Lost", function (lost) {
            moduleServerSocket.lostGame = lost;
        });

        socket.on("Win", function (time) {
            moduleServerSocket.wonGame = true;
            moduleServerSocket.time = time;
        });

        socket.on("disconnect", function () {
            socketConnected--;
            console.log("disconnected. Number of connections remaining: " + socketConnected);
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
        serverSocket.sockets.emit("updatePlayerData", jsonToSend);
    }

    function pauseOrResumeMaze() {
        serverSocket.sockets.emit("toggleTimer");


    }

    function resetMaze() {
        let mazeName = mazeBeingEdited.id;
        let cols = mazeBeingEdited.cols;
        let rows = mazeBeingEdited.rows;
        mazeFile.createNewMaze(mazeName, cols, rows, function (maze) {
            mazeBeingEdited = maze;
            if (maze != null) {
                sockets.emit("updateMazeData",
                    {
                        cells: mazeBeingEdited.cells,
                        beginPoint: mazeBeingEdited.beginPoint,
                        endPoint: mazeBeingEdited.endPoint
                    });
                sockets.emit("updatePlayerData",
                    {
                        previousX: mazeBeingEdited.beginPoint.x,
                        previousY: mazeBeingEdited.beginPoint.y,
                        newX: mazeBeingEdited.player.x,
                        newY: mazeBeingEdited.player.y
                    })

            } else {
                sockets.emit("Error", "no Maze Found");
            }
        });
    }

    return {
        serverSocket: serverSocket,
        movePlayerFromSerial: movePlayerFromSerial,
        pauseOrResumeMaze: pauseOrResumeMaze,
        resetMaze : resetMaze,
        wonGame: this.wonGame,
        lostGame: this.lostGame
    }
}();


module.exports = moduleServerSocket;
