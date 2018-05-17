"use strict";

const socket = io();
const startDuration = 10*60;
let duration = startDuration;
let isPaused = false;
let interval;

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

function showRandomRubenMeme() {
    let rootFolder = "/images/";
    let imgPaths = ["spy.jpg","KingOfHearts.png","kore empire flag.jpg", "mlp.png",
        "PatrickWest.png","TheBattleHasBegun.png","ToBattleMen.gif"];
    let randomMemePath = imgPaths[Math.floor(Math.random()*imgPaths.length)];
    let $meme = document.getElementById("meme");
    $meme.src = rootFolder + randomMemePath;
    $meme.style.display = "block";
    setTimeout(function () {
        $meme.src = "#";
        $meme.style.display = "none";
    }, 1000);
}

$(function () {
    console.log("JQUERY AND DOM READY");

    console.log(mazeName);

    startTimer();


    socket.emit("joinMaze", {mazeName: mazeName, cols: width, rows:height});

    createMazeGridHtml(mazeName, height, width);

    socket.on("Error", function (err) {
        console.log(err);
    });

    socket.on("updateMazeData", function (mazeData) {
        console.log(mazeData);
        createMazeElement(mazeName, mazeData.cells, mazeData.beginPoint, mazeData.endPoint);
        if(mazeData.reset){
            document.getElementById('ruben').parentNode.removeChild(document.getElementById('ruben'));
            duration = startDuration;
            isPaused = false;
            pauseTimer();
        }
    });
    let playerCurrCoords;
    socket.on("updatePlayerData", function (playerData) {
        console.log(playerData);
        updatePlayerLocations(mazeName, true, playerData.previousX, playerData.previousY, playerData.newX, playerData.newY);
        playerCurrCoords = {x:playerData.newX, y:playerData.newY};
        if(playerData.won){
            isPaused = true;
            pauseTimer();
            socket.emit("Win", duration);
        }
    });

    socket.on("updateRubenData", function (rubenData) {
        updatePlayerLocations(mazeName, false, rubenData.previousX, rubenData.previousY, rubenData.newX, rubenData.newY);
        if(playerCurrCoords.x === rubenData.newX && playerCurrCoords.y === rubenData.newY){
            duration -= 10;
            showRandomRubenMeme();
        }
    });

    socket.on("toggleTimer", function () {
        isPaused = !isPaused;
        pauseTimer();
    });

    socket.on("insertHighscores",function (highscores) {
        console.log(highscores);
        let highscoresUl = document.getElementById('highscores');
        highscoresUl.innerHTML = '';
        highscores.forEach(score=>{
            let li = document.createElement('li');
            li.innerText = score;
            highscoresUl.appendChild(li)
        });
    });

    Array.from(document.getElementsByClassName("playerButton")).forEach(function(element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            let directionToGo = this.id;
            socket.emit("movePlayer", directionToGo);
        })
    });



});