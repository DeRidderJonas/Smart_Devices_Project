let endPointPosition;

function getId(tableId, row, col) {
    return `${tableId}-${row}-${col}`;
}

function createMazeGridHtml(id, height, width) {

    const table = document.createElement('table');
    table.id = id;

    table.rows = height;
    table.cols = width;

    table.classList.add("grid");

    document.body.appendChild(table);

    for (let r = 0; r < height; r++) {
        let row = document.createElement('tr');
        table.appendChild(row);
        for (let c = 0; c < width; c++) {
            let cell = document.createElement('td');
            cell.classList.add("cell");
            let cellId = getId(id, r, c);
            cell.id = cellId;
            cell.innerText = " ";

            row.appendChild(cell);
        }
    }
}

function createMazeElement(id, cells, beginPoint, endPoint) {
    cells.forEach(function (cellRow) {
        cellRow.forEach(function (cell) {
            let htmlCell = getCell(id, cell.y, cell.x);
            if(cell.walls[0]) {htmlCell.classList.add("topWall");} else {htmlCell.classList.remove("topWall");}
            if(cell.walls[1]) {htmlCell.classList.add("rightWall");} else {htmlCell.classList.remove("rightWall");}
            if(cell.walls[2]) {htmlCell.classList.add("bottomWall");} else {htmlCell.classList.remove("bottomWall");}
            if(cell.walls[3]) {htmlCell.classList.add("leftWall");} else {htmlCell.classList.remove("leftWall");}
        })
    });

    let htmlBeginCell = getCell(id, beginPoint.y, beginPoint.x);
    let htmlEndCell = getCell(id, endPoint.y, endPoint.x);

    if(endPointPosition != null){
        endPointPosition.classList.remove("endMaze");
    }
    endPointPosition = htmlEndCell;

    htmlBeginCell.classList.add("beginMaze");
    endPointPosition.classList.add("endMaze");
}

function updatePlayerLocations(mazeName, actualPlayer, previousX, previousY, x, y) {
    let htmlPreviousCell = getCell(mazeName, previousY, previousX);
    htmlPreviousCell.innerText = " ";
    let htmlCell = getCell(mazeName, y, x);
    if(actualPlayer){htmlCell.innerHTML = "<img id='player' src='../images/Koreman.png'/>"}
    else{htmlCell.innerHTML = "<img id='ruben' src='../images/Ruben.png'/>"} //get ruben head
    playerPosition = htmlCell;
}

function getCell(gridId, row, col) {
    let id = getId(gridId, row, col);
    //console.log(id);
    return document.getElementById(id);
}
