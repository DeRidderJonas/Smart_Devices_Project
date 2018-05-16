"use strict";

$(function () {
    console.log("JQUERY AND DOM READY");

    console.log(mazeName);
    const socket = io();
    let duration = 3;
    let isPaused = false;
    let interval;
    startTimer();


    socket.emit("joinMaze", {mazeName: mazeName, cols: width, rows:height});

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
        if(playerData.won){
            pauseTimer();
            socket.emit("Win", duration);
        }
    });

    socket.on("toggleTimer", function () {
        isPaused = !isPaused;
        pauseTimer();
    });

    Array.from(document.getElementsByClassName("playerButton")).forEach(function(element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            let directionToGo = this.id;
            socket.emit("movePlayer", directionToGo);
        })
    });


    function startTimer() {
        interval = setInterval(countdownTimer, 1000);
    }
    function pauseTimer() {
        if(isPaused){
            clearInterval(interval);
        } else {
            startTimer();
        }
    }

    function countdownTimer() {
        let minutes, seconds;
        minutes = parseInt(duration / 60, 10);
        seconds = parseInt(duration % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        let display = document.getElementById("time");
        display.textContent = minutes + ":" + seconds;

        if (--duration < 0) {
            clearInterval(interval);
            socket.emit("Lost", true);
        }
    }
});