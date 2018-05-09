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

    let htmlBeginCell = getCell(id, beginPoint.y, beginPoint.y);
    let htmlEndCell = getCell(id, endPoint.y, endPoint.x);

    htmlBeginCell.classList.add("beginMaze");
    htmlEndCell.classList.add("endMaze");
}

function updatePlayerLocations(mazeName, previousX, previousY, x, y) {
    let htmlPreviousCell = getCell(mazeName, previousY, previousX);
    htmlPreviousCell.innerText = " ";
    let htmlCell = getCell(mazeName, y, x);
    htmlCell.innerText = "x";
}

function getCell(gridId, row, col) {
    let id = getId(gridId, row, col);
    //console.log(id);
    return document.getElementById(id);
}
