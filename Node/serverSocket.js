/**
 * Created by micha on 21/03/2018.
 */
const io = require('socket.io');
const classes = require("./backend/classes");
const mazeFile = require("./backend/fileFunctions");

let moduleServerSocket = function () {
    let SocketCombinations = [];
    const serverSocket = io();

    serverSocket.on("connection", function (socket) {
        //console.log(serverSocket.sockets.adapter.rooms); //check the rooms
        console.log("Connection received");

        socket.on("joinMaze", function (mazeName) {
            mazeFile.GetMazeData(mazeName, function (mazeJSON) {
                if (mazeJSON != null) {
                    let mazeForSocket = classes.ConvertJsonToMaze(mazeJSON);

                    SocketCombinations.push({
                        socket: socket,
                        maze : mazeForSocket,
                        player: mazeForSocket.player
                    });

                    socket.join('maze/' + mazeName);

                    socket.emit("updateMazeData",
                        {cells : mazeForSocket.cells, beginPoint : mazeForSocket.beginPoint, endPoint : mazeForSocket.endPoint});
                    socket.emit("updatePlayerData",
                        {
                            previousX : mazeForSocket.beginPoint.x,
                            previousY : mazeForSocket.beginPoint.y,
                            newX : mazeForSocket.player.x,
                            newY : mazeForSocket.player.y
                        })

                } else {
                    socket.emit("Error", "no Maze Found");
                }
            });
        });

        function parseDirection(dirAsString){
            return classes.Directions.find(d => d.name == dirAsString);
        }

        socket.on("movePlayer", function (directionString) {
            let direction = parseDirection(directionString);
            let socketMazeData = SocketCombinations.find(comb => comb.socket == socket);
            let maze = socketMazeData.maze;
            let player = socketMazeData.player;

            let jsonToSend = maze.updateMaze(player, direction);
            socket.emit("updatePlayerData", jsonToSend);
        });

        socket.on("disconnect", function () {
            let ComboOfSocket = SocketCombinations.find(socketCombo => socketCombo.socket == socket);
            if (ComboOfSocket != null) {
                let maze = ComboOfSocket.maze;
                maze.player = ComboOfSocket.player;
                mazeFile.SaveMaze(maze, function (err) {
                    if(err){
                        console.log(err);
                    } else {
                        socket.leave('maze/' + maze.id);
                        let index = SocketCombinations.indexOf(ComboOfSocket);
                        SocketCombinations.splice(index, 1);
                        console.log("disconnected");
                    }
                });
            } else {
                console.log("failed");
            }
        });
    });

    function movePlayerFromSerial(directionString) {
        let socketMazeData = SocketCombinations.find(comb => comb.socket == socket);
        let direction = parseDirection(directionString);
        let maze = socketMazeData.maze;
        let player = socketMazeData.player;

        let jsonToSend = maze.updateMaze(player, direction);
        io.sockets.in("maze/"+maze.id).emit("updatePlayerData", jsonToSend);
    }

    return {
        serverSocket : serverSocket,
        movePlayerFromSerial : movePlayerFromSerial
    }
}();



module.exports = moduleServerSocket;
