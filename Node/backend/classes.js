/**
 * Created by micha on 29/04/2018.
 */
const moduleClasses = function () {

    const directions = [
        {id : 0, name : "up", x : 0, y : -1}, //N
        {id : 1, name : "right", x : 1, y: 0}, //E
        {id : 2, name : "down", x : 0, y: 1}, //S
        {id : 3, name : "left", x : -1, y : 0} //W
    ];

    function convertJSONToPlayer(json) {
        return new Player (json.x, json.y);
    }

    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.directionMoving = {x : 0, y : 0};
    }

    Player.prototype.changeLocation = function (direction) {
        this.x = this.x + direction.x;
        this.y = this.y + direction.y;
        this.directionMoving = direction;
    };

    function convertJSONToCell(jsonArrayOfCells) {
        jsonArrayOfCells.forEach(cellRow => cellRow.forEach(function (cell, index, array) {
           array[index] = new Cell(cell.y, cell.x, cell.walls, cell.visited);
        }));
    }

    function CellSmall(y, x) {
        return new Cell(y, x, [true, true, true, true], false);
    }

    function Cell(y, x, walls, visited) {
        this.x = x;
        this.y = y;
        this.walls = walls;
        this.visited = visited;
    }

    Cell.prototype.visitCell = function () {
        this.visited = true;
    };

    function Maze(id, player, width, height, cells) {
        this.id = id;
        this.player = player;
        this.width = width;
        this.height = height;
        this.cells = cells;
        this.beginPoint = null;
        this.endPoint = null;
    }

    function convertJsonToMaze(json) {
        let player = convertJSONToPlayer(json.player);
        convertJSONToCell(json.cells);
        return new Maze(json.id, player, json.width, json.height, json.cells, json.beginPoint, json.endPoint);
    }

    function Maze(id, player, width, height, cells, beginPoint, endPoint) {
        this.id = id;
        this.player = player;
        this.width = width;
        this.height = height;
        this.cells = cells;
        this.beginPoint = beginPoint;
        this.endPoint = endPoint;
    }

    Maze.prototype.checkIfWon = function (player) {
        if(player.x == this.endPoint.x && player.y == this.endPoint.y){
            return true;
        }else return false;
    };

    function PlayerData() {
        this.previousX = "";
        this.previousY = "";
        this.newX = "";
        this.newY = "";
        this.won = false;
    }

    Maze.prototype.updateMaze = function (player, direction) {
        let jsonToSend = new PlayerData();
        jsonToSend.previousX = player.x;
        jsonToSend.previousY = player.y;

        if(this.validatePlayerMove(player, direction)) {
            this.player = player;
            this.player.changeLocation(direction);
        }

        jsonToSend.newX = player.x;
        jsonToSend.newY = player.y;

        jsonToSend.won = this.checkIfWon(player);
        return jsonToSend
    };

    Maze.prototype.validatePlayerMove = function (player, direction) {
        let playerCell = this.getCell(player.y, player.x);
        let allowed = false;
        let nextCellX = player.x + direction.x;
        let nexCellY = player.y + direction.y;
        let nextCell;
        if(!(nextCellX < 0 || nextCellX >= this.width || nexCellY < 0 || nexCellY >= this.height)) {
            nextCell = this.getCell(nexCellY, nextCellX);
        }

        switch (direction.id){
            case 0:
                if(nextCell && (!playerCell.walls[0] && !nextCell.walls[2])){allowed = true}
                break;
            case 1:
                if(nextCell && (!playerCell.walls[1] && !nextCell.walls[3])){allowed = true}
                break;
            case 2:
                if(nextCell && (!playerCell.walls[2] && !nextCell.walls[0])){allowed = true}
                break;
            case 3:
                if(nextCell && (!playerCell.walls[3] && !nextCell.walls[1])){allowed = true}
                break;
        }
        return allowed;
    };

    Maze.prototype.selectBeginAndEndPoint = function (endPoints) {
        let thisMaze = this;
        let beginPoint = thisMaze.getCell(0, 0);
        let selectedEndPoint = thisMaze.getCell(0, 0);
        endPoints.forEach(function (endPoint) {
            if(endPoint.x > selectedEndPoint.x || endPoint.y > selectedEndPoint.y){
                selectedEndPoint = thisMaze.getCell(endPoint.y, endPoint.x);
            }
        });

        thisMaze.beginPoint = beginPoint;
        thisMaze.endPoint = selectedEndPoint;
    };

    Maze.prototype.getCell = function(row, col){
        return this.cells[row][col];
    };

    return {
        Directions : directions,
        Player : Player,
        CellSmall : CellSmall,
        Cell : Cell,
        ConvertJsonToMaze : convertJsonToMaze,
        Maze : Maze
    }
}();

module.exports = moduleClasses;
