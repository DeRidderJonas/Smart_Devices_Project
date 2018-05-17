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
    this.scores = [];

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
                        });
                    insertHighscores();
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

            let ruben = mazeBeingEdited.ruben;
            let rubenDirectionInfo = ruben.directionInfo;
            let rubenDirection;
            let stuckCounter = 0;
            do {
                let randomDir = Math.floor(Math.random() * 4);
                rubenDirection = parseDirection([{id: 0, dir: "up"}, {id: 1, dir: "down"}, {id: 2, dir: "left"}, {id: 3, dir: "right"}]
                    .filter(d => d.id === randomDir).map(d => d.dir));

            } while (!mazeBeingEdited.validatePlayerMove(ruben, rubenDirection));

            let rubenToSend = mazeBeingEdited.updateMaze(ruben, rubenDirection);
            serverSocket.sockets.emit("updateRubenData", rubenToSend);
        });

        socket.on("Lost", function (lost) {
            console.log("game is lost");
            moduleServerSocket.lostGame = lost;
        });

        socket.on("Win", function (time) {
            console.log("game is won");
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
        if(!moduleServerSocket.wonGame && !moduleServerSocket.lostGame){
            let direction = parseDirection(directionString);
            let player = mazeBeingEdited.player;

            let jsonToSend = mazeBeingEdited.updateMaze(player, direction);
            serverSocket.sockets.emit("updatePlayerData", jsonToSend);

            let ruben = mazeBeingEdited.ruben;
            let rubenDirectionInfo = ruben.directionInfo;
            let rubenDirection;
            let stuckCounter = 0;
            do {
                let randomDir = Math.floor(Math.random() * 4);
                rubenDirection = parseDirection([{id: 0, dir: "up"}, {id: 1, dir: "down"}, {id: 2, dir: "left"}, {id: 3, dir: "right"}]
                    .filter(d => d.id === randomDir).map(d => d.dir));

            } while (!mazeBeingEdited.validatePlayerMove(ruben, rubenDirection));


            let availableDirections = ["up","down","left","right"].filter(dir=>mazeBeingEdited.validatePlayerMove(ruben, parseDirection(dir)))
                .filter(dir=>dir !== rubenDirectionInfo.cameFromDirection);
            if(availableDirections.length > 0){
                let randomDir = Math.floor(Math.random()*availableDirections.length);
                rubenDirection = availableDirections[randomDir];
                ruben.directionInfo.cameFromDirection = findCounterDirection(availableDirections[randomDir]);
            }else{
                rubenDirection = ruben.directionInfo.cameFromDirection;
                ruben.directionInfo.cameFromDirection = findCounterDirection(ruben.directionInfo.cameFromDirection);
            }

            let rubenToSend = mazeBeingEdited.updateMaze(ruben, parseDirection(rubenDirection));
            serverSocket.sockets.emit("updateRubenData", rubenToSend);
        }
    }

    function findCounterDirection(dir){
        switch(dir){
            case "up":
                return "down";
                break;
            case "down":
                return "up";
                break;
            case "left":
                return "right";
                break;
            case "right":
                return "left";
                break;
            default:
                return "none";
        }
    }

    function pauseOrResumeMaze() {
        serverSocket.sockets.emit("toggleTimer");
    }

    function resetMaze() {
        moduleServerSocket.wonGame = false;
        moduleServerSocket.lostGame = false;
        let mazeName = mazeBeingEdited.id;
        let cols = mazeBeingEdited.width;
        let rows = mazeBeingEdited.height;

        mazeFile.createNewMaze(mazeName, cols, rows, function (maze) {
            if (maze != null) {
                serverSocket.sockets.emit("updateMazeData",
                    {
                        cells: maze.cells,
                        beginPoint: maze.beginPoint,
                        endPoint: maze.endPoint,
                        reset: true
                    });
                serverSocket.sockets.emit("updatePlayerData",
                    {
                        previousX: mazeBeingEdited.player.x,
                        previousY: mazeBeingEdited.player.y,
                        newX: maze.player.x,
                        newY: maze.player.y
                    });
                mazeBeingEdited = maze;
            } else {
                serverSocket.sockets.emit("Error", "no Maze Found");
            }
        });
    }

    function setHighscores(highscores) {
        serverSocket.scores = highscores;
        console.log("set scores", serverSocket.scores);
    }

    function insertHighscores() {
        console.log("emitting scores", serverSocket.scores);
        serverSocket.sockets.emit("insertHighscores", serverSocket.scores);
    }

    return {
        serverSocket: serverSocket,
        movePlayerFromSerial: movePlayerFromSerial,
        pauseOrResumeMaze: pauseOrResumeMaze,
        resetMaze: resetMaze,
        wonGame: this.wonGame,
        lostGame: this.lostGame,
        setHighscores, insertHighscores
    }
}();


module.exports = moduleServerSocket;
