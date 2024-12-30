const createGrid = () => {
    const table = document.getElementsByTagName("table")[0];
    for (let i = 0; i < 16; i++){
        const row = document.createElement("tr");
        for (let j = 0; j < 16; j++){
            const cell = document.createElement("td");
            cell.bombFlag = false;
            cell.count = 0; 
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
            selectedCell.style.backgroundColor = "red";
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
                        cellAbove.innerHTML = cellAbove.count;
                    }

                    if (!(j === 0)){
                        const cellAboveLeft = rows[i - 1].getElementsByTagName("td")[j - 1];
                        if (! cellAboveLeft.bombFlag){
                            cellAboveLeft.count += 1;
                            cellAboveLeft.innerHTML = cellAboveLeft.count;
                        }
                    }
    
                    if (!(j === rows.length - 1)){
                        const cellAboveRight = rows[i - 1].getElementsByTagName("td")[j + 1];
                        if (! cellAboveRight.bombFlag){
                            cellAboveRight.count += 1;
                            cellAboveRight.innerHTML = cellAboveRight.count;
                        }
                    }
                }

                //checking cells on same row 
                if (!(j === 0)){
                    const cellLeft = rows[i].getElementsByTagName("td")[j - 1];
                    if (! cellLeft.bombFlag){
                        cellLeft.count += 1;
                        cellLeft.innerHTML = cellLeft.count;
                    }
                }

                if (!(j === rows.length - 1)){
                    const cellRight = rows[i].getElementsByTagName("td")[j + 1];
                    if (! cellRight.bombFlag){
                        cellRight.count += 1;
                        cellRight.innerHTML = cellRight.count;
                    }
                }

                //checking cells below 
                if (! (i === rows.length - 1)){
                    const cellBelow = rows[i + 1].getElementsByTagName("td")[j];
                    if (! cellBelow.bombFlag){
                        cellBelow.count += 1;
                        cellBelow.innerHTML = cellBelow.count;
                    }

                    if (!(j === 0)){
                        const cellBelowLeft = rows[i + 1].getElementsByTagName("td")[j - 1];
                        if (! cellBelowLeft.bombFlag){
                            cellBelowLeft.count += 1;
                            cellBelowLeft.innerHTML = cellBelowLeft.count;
                        }
                    }
    
                    if (!(j === rows.length - 1)){
                        const cellBelowRight = rows[i + 1].getElementsByTagName("td")[j + 1];
                        if (! cellBelowRight.bombFlag){
                            cellBelowRight.count += 1;
                            cellBelowRight.innerHTML = cellBelowRight.count;
                        }
                    }
                }
            }
        }
    }
}

createGrid();