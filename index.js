const createGrid = () => {
    const table = document.getElementsByTagName("table")[0];
    for (let i = 0; i < 16; i++){
        const row = document.createElement("tr");
        for (let j = 0; j < 16; j++){
            const cell = document.createElement("td");
            cell.bombFlag = false;
            cell.count = 0; 
            cell.clicked = false; 
            cell.flagPlaced = false; 
            cell.addEventListener("click", () => revealCell(i, j));
            cell.addEventListener("contextmenu", (e) => placeFlag(e, i, j));
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    placeMines();
    setBombCounts();
}

const placeMines = () => {
    const table = document.getElementsByTagName("table")[0];
    let bombs = 0;

    while (bombs < 40){
        let rowNumber = Math.floor(Math.random() * 16);
        let columnNumber = Math.floor(Math.random() * 16);

        const selectedRow = table.getElementsByTagName("tr")[rowNumber];
        const selectedCell = selectedRow.getElementsByTagName("td")[columnNumber];

        if (!selectedCell.bombFlag){
            selectedCell.bombFlag = true; 
            bombs++; 
        }
    }
}

const setBombCounts = () => {
    const rows = document.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++){
        const row = rows[i];
        for (let j = 0; j < rows.length; j++){
            const cell = row.getElementsByTagName("td")[j];

            if (cell.bombFlag){
                //checking cells above 
                if (!(i === 0)){
                    const cellAbove = rows[i - 1].getElementsByTagName("td")[j];
                    if (! cellAbove.bombFlag){
                        cellAbove.count += 1;
                    }

                    if (!(j === 0)){
                        const cellAboveLeft = rows[i - 1].getElementsByTagName("td")[j - 1];
                        if (! cellAboveLeft.bombFlag){
                            cellAboveLeft.count += 1;
                        }
                    }
    
                    if (!(j === rows.length - 1)){
                        const cellAboveRight = rows[i - 1].getElementsByTagName("td")[j + 1];
                        if (! cellAboveRight.bombFlag){
                            cellAboveRight.count += 1;
                        }
                    }
                }

                //checking cells on same row 
                if (!(j === 0)){
                    const cellLeft = rows[i].getElementsByTagName("td")[j - 1];
                    if (! cellLeft.bombFlag){
                        cellLeft.count += 1;
                    }
                }

                if (!(j === rows.length - 1)){
                    const cellRight = rows[i].getElementsByTagName("td")[j + 1];
                    if (! cellRight.bombFlag){
                        cellRight.count += 1;
                    }
                }

                //checking cells below 
                if (! (i === rows.length - 1)){
                    const cellBelow = rows[i + 1].getElementsByTagName("td")[j];
                    if (! cellBelow.bombFlag){
                        cellBelow.count += 1;
                    }

                    if (!(j === 0)){
                        const cellBelowLeft = rows[i + 1].getElementsByTagName("td")[j - 1];
                        if (! cellBelowLeft.bombFlag){
                            cellBelowLeft.count += 1;
                        }
                    }
    
                    if (!(j === rows.length - 1)){
                        const cellBelowRight = rows[i + 1].getElementsByTagName("td")[j + 1];
                        if (! cellBelowRight.bombFlag){
                            cellBelowRight.count += 1;
                        }
                    }
                }
            }
        }
    }
}

const revealCell = (x, y) => {
    const rows = document.getElementsByTagName("tr");
    const rowClicked = rows[x];
    const cellClicked = rowClicked.getElementsByTagName("td")[y];

    if (cellClicked.bombFlag) {
        gameOver(cellClicked);
        return;
    }

    if (x < 0 || x >= 16 || y < 0 || y >= 16 || cellClicked.clicked || cellClicked.flagPlaced) {
        return;
    }

    cellClicked.clicked = true;

    const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"];
    cellClicked.classList += numbers[cellClicked.count];

    if (cellClicked.count > 0){
        cellClicked.innerHTML = cellClicked.count;
    }

    if (cellClicked.count === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < 16 && newY >= 0 && newY < 16) {
                    const newRow = rows[newX];
                    const newCell = newRow.getElementsByTagName("td")[newY];
                    if (!newCell.clicked && !newCell.flagPlaced) {
                        revealCell(newX, newY);
                    }
                }
            }
        }
    }
}

const placeFlag = (e, i, j) => {
    e.preventDefault(); 

    const rowClicked = document.getElementsByTagName("tr")[i];
    const cellClicked = rowClicked.getElementsByTagName("td")[j];

    if (!cellClicked.clicked){
        if (!cellClicked.flagPlaced){
            cellClicked.classList += "flag";
            cellClicked.flagPlaced = true; 
        } else {
            cellClicked.classList = "";
            cellClicked.flagPlaced = false; 
        }
    }
}

const gameOver = (cellClicked) => {
    cellClicked.classList += "bomb";
    cellClicked.style.backgroundColor = "red";

    for (let i = 0; i < 16; i++){
        for (let j = 0; j < 16; j++){
            const row = document.getElementsByTagName("tr")[i];
            const cell = row.getElementsByTagName("td")[j]; 

            if (cell.bombFlag && !cell.flagPlaced){
                cell.classList = "bomb";
            } 

            if (!cell.bombFlag && cell.flagPlaced){
                cell.classList = "cross";
            }

            cell.replaceWith(cell.cloneNode(true)); //removing all event listeners 
        }
    }
}

createGrid();