/**
 * Created by micha on 9/05/2018.
 */
var fs = require('fs');
var classes = require("./classes");

let moduleFile = function () {
    function getMazes(cb) {
        fs.readFile('./backend/mazes.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let mazes = JSON.parse(data);
                cb(mazes);
            }
        });
    }

    function getMazeOrMakeNewMaze(mazeName, cb) {
        fs.readFile('./backend/mazes.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let mazes = JSON.parse(data);
                if (!doesMazeExist(mazes, mazeName)) {
                    let maze = createNewMaze(mazeName, 16, 16);
                    mazes.push(maze);
                    mazes = JSON.stringify(mazes);
                    saveMazes(mazes, function () {
                        cb();
                    });
                } else {
                    cb();
                }
            }
        });
    }

    function doesMazeExist(mazes, mazeName) {
        let result = false;
        mazes.forEach(function (maze) {
            if (maze.id == mazeName) {
                result = true;
            }
        });
        return result;
    }



    function getMazeData(mazeName, cb) {
        fs.readFile('./backend/mazes.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let mazes = JSON.parse(data);
                let mazeToFind =  findMazeInMazesArray(mazes, mazeName);
                cb(mazeToFind);
            }
        });
    }

    function findMazeInMazesArray(mazes, mazeName) {
        return mazes.find(m => m.id == mazeName) || null;
    }

    function saveMaze(maze, cb) {
        getMazes(function (mazes) {
            const index = findIndexOfMaze(mazes, maze);
            mazes[index] = maze;
            mazes = JSON.stringify(mazes);

            saveMazes(mazes, cb);
        });
    }

    function saveMazes(mazes, cb) {
        fs.writeFile("./backend/mazes.json", mazes, function (err) {
            if (err) {
                return console.log(err);
            }
            cb();
        });
    }

    function findIndexOfMaze(mazes, mazeToFind) {
        let indexToReturn = -1;
        mazes.forEach(function (maze, index) {
            if(maze.id == mazeToFind.id){
                indexToReturn = index;
            }
        });
        return indexToReturn;
    }

    //maze generating
    function createNewMaze(mazeName, rows, cols) {
        let player = new classes.Player(0, 0);
        const cellsForMaze = makeTwoDimensionalArray(rows, cols);
        const directions = [
            {id : 1, x : 0, y : -1}, //N
            {id : 2, x : 1, y: 0}, //E
            {id : 3, x : 0, y: 1}, //S
            {id : 4, x : -1, y : 0} //W
        ];
        let maze = new classes.Maze(mazeName, player, cols, rows, cellsForMaze);
        let path = [];
        let possibleEndPoints = [];
        let backtrackingCells = 0;

        let x = 0;
        let y = 0;
        let currentcell = maze.getCell(y, x);
        currentcell.visitCell();

        while(AnyUnvistedCellsRemaining(maze)){
            if(checkForNeighBourghCells(maze, currentcell, directions)){
                backtrackingCells = 0;
                let unvisitedCells = giveNeighbouringCells(maze, currentcell, directions);

                let randomNumberForUnvisitedCell = Math.floor(Math.random() * unvisitedCells.length) + 1;
                let nextNeighbour = unvisitedCells[randomNumberForUnvisitedCell - 1].cell;
                let directionID = unvisitedCells[randomNumberForUnvisitedCell - 1].directionID;

                removeWall(currentcell, nextNeighbour, directionID);
                path.push(currentcell);
                currentcell = nextNeighbour;
                nextNeighbour.visitCell();
            } else if(path.length > 0){
                backtrackingCells++;
                if(backtrackingCells == 1) {
                    possibleEndPoints.push(currentcell);
                }
                currentcell = path[path.length - 1];
                path.pop();
            }
        }
        maze.selectBeginAndEndPoint(possibleEndPoints);
        return maze;
    }

    function makeTwoDimensionalArray(size1, size2) {
        let arr = [];
        for(let r = 0; r < size1; r++) {
            arr[r] = [];
            for(let c = 0; c < size2; c++) {
                arr[r][c] = new classes.CellSmall(r, c);
            }
        }
        return arr;
    }

    /**
     * @return {boolean}
     */
    function AnyUnvistedCellsRemaining(maze) {
        for(let i = 0; i < maze.height; i++){
            for(let j = 0; j < maze.width; j++){
                if(maze.getCell(j, i).visited == false){
                    return true;
                }
            }
        }
        return false;
    }

    function checkForNeighBourghCells(maze, cell, directions) {
        let findAnyNeighours = false;
        directions.forEach(function (direction) {
            let nextCellx = cell.x + direction.x;
            let nextCelly = cell.y + direction.y;
            if(!(nextCellx < 0 || nextCellx >= maze.width || nextCelly < 0 || nextCelly >= maze.height)){
                if(maze.getCell(nextCelly, nextCellx).visited == false){
                    findAnyNeighours = true;
                }
            }
        });
        return findAnyNeighours;
    }

    function giveNeighbouringCells(maze, cell, directions) {
        let unvisitedCells = [];
        directions.forEach(function (direction) {
            let nextCellx = cell.x + direction.x;
            let nextCelly = cell.y + direction.y;
            if (!(nextCellx < 0 || nextCellx >= maze.width || nextCelly < 0 || nextCelly >= maze.height)) {
                if (maze.getCell(nextCelly, nextCellx).visited == false) {
                    unvisitedCells.push({cell : maze.getCell(nextCelly, nextCellx), directionID : direction.id});
                }
            }
        });
        return unvisitedCells;
    }

    function removeWall(currentCell, nextCell, directionID) {
        switch (directionID){
            case 1: //N
                currentCell.walls[0] = false;
                nextCell.walls[2] = false;
                break;
            case 2: //E
                currentCell.walls[1] = false;
                nextCell.walls[3] = false;
                break;
            case 3: //S
                currentCell.walls[2] = false;
                nextCell.walls[0] = false;
                break;
            case 4: //W
                currentCell.walls[3] = false;
                nextCell.walls[1] = false;
                break;
        }
    }

    return {
        GetMazeOrMakeNewMaze : getMazeOrMakeNewMaze,
        GetMazeData : getMazeData,
        SaveMaze : saveMaze
    }
}();

module.exports = moduleFile;

