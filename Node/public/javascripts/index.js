"use strict";

$(function () {
    console.log("JQUERY AND DOM READY");

    console.log(mazeName);
    const socket = io();
    socket.emit("joinMaze", mazeName);

    createMazeGridHtml(mazeName, height, width);

    socket.on("Error", function (err) {
        console.log(err);
    });

    socket.on("updateMazeData", function (mazeData) {
        console.log(mazeData);
        createMazeElement(mazeName, mazeData.cells, mazeData.beginPoint, mazeData.endPoint);
    });

    socket.on("updatePlayerData", function (playerData) {
        console.log(playerData);
        updatePlayerLocations(mazeName, playerData.previousX, playerData.previousY, playerData.newX, playerData.newY);
    });


    Array.from(document.getElementsByClassName("playerButton")).forEach(function(element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            let directionToGo = this.id;
            socket.emit("movePlayer", directionToGo);
        })
    });
});