let revealedCells = 0;
let flagsPlaced = 0;
let bombCount = 40; 
let size = 16;
let timerInterval;

const createGrid = () => {
    const table = document.getElementsByTagName("table")[0];
    for (let i = 0; i < size; i++){
        const row = document.createElement("tr");
        for (let j = 0; j < size; j++){
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

    const bombCounter = document.getElementsByTagName("span")[0];
    bombCounter.innerHTML = bombCount;

    const timer = document.getElementById("time");
    timer.innerHTML = "00:00";

    const gameMode = document.getElementsByName("game-mode");
    for (let i = 0; i < gameMode.length; i++){
        gameMode[i].addEventListener("click", changeSize);
    }

    placeMines();
    setBombCounts();
}

const placeMines = () => {
    const table = document.getElementsByTagName("table")[0];
    let bombs = 0;

    while (bombs < bombCount){
        let rowNumber = Math.floor(Math.random() * size);
        let columnNumber = Math.floor(Math.random() * size);

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

    if (!timerInterval) {
        startTimer();
    }

    if (cellClicked.bombFlag) {
        gameOver(cellClicked);
        return;
    }

    if (x < 0 || x >= size || y < 0 || y >= size || cellClicked.clicked || cellClicked.flagPlaced) {
        return;
    }

    if (!cellClicked.clicked){
        cellClicked.clicked = true;
        revealedCells++; 
    }

    const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"];
    cellClicked.classList.add(numbers[cellClicked.count]);

    if (cellClicked.count > 0){
        cellClicked.innerHTML = cellClicked.count;
    }

    if ((revealedCells === (size * size) - bombCount) && flagsPlaced === bombCount){
        gameWon();
    }

    if (cellClicked.count === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
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

    const bombCounter = document.getElementsByTagName("span")[0];

    if (!cellClicked.clicked){
        if (!cellClicked.flagPlaced){
            cellClicked.classList.add("flag");
            cellClicked.flagPlaced = true; 
            bombCounter.innerHTML = parseInt(bombCounter.innerHTML) - 1;
            flagsPlaced++;
        } else {
            cellClicked.classList.remove("flag");
            cellClicked.flagPlaced = false; 
            bombCounter.innerHTML = parseInt(bombCounter.innerHTML) + 1;
            flagsPlaced--;
        }
    }

    if ((revealedCells === (size * size) - bombCount) && flagsPlaced === bombCount){
        gameWon();
    }
}

const gameOver = (cellClicked) => {
    cellClicked.classList.add("bomb");
    cellClicked.style.backgroundColor = "red";

    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
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

    const gameLost = document.getElementsByClassName("game-over")[0];
    gameLost.style.display = "block";

    revealedCells = 0;
    flagsPlaced = 0;

    const playAgain = document.getElementsByTagName("input")[4];
    playAgain.addEventListener("click", resetGame);

    clearInterval(timerInterval);
    timerInterval = null;
}

const gameWon = () => {
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            const row = document.getElementsByTagName("tr")[i];
            const cell = row.getElementsByTagName("td")[j];
            cell.replaceWith(cell.cloneNode(true)); //removing all event listeners 
        }
    }

    const gameWin = document.getElementsByClassName("game-win")[0];
    gameWin.style.display = "block";

    const playAgain = document.getElementsByTagName("input")[5];
    playAgain.addEventListener("click", resetGame);

    revealedCells = 0;
    flagsPlaced = 0;

    clearInterval(timerInterval);
    timerInterval = null;
}

const resetGame = () => {
    const table = document.getElementsByTagName("table")[0];
    table.innerHTML = "";
    createGrid();

    const gameLost = document.getElementsByClassName("game-over")[0];
    gameLost.style.display = "none";

    const gameWin = document.getElementsByClassName("game-win")[0];
    gameWin.style.display = "none";

    revealedCells = 0;
    flagsPlaced = 0;
}

const changeSize = () => {
    const selectedMode = document.querySelector('input[name="game-mode"]:checked').value;
    switch (selectedMode){
        case "beginner":
            bombCount = 10; 
            size = 9;
            break;
        case "intermediate":
            bombCount = 30; 
            size = 15;
            break; 
        case "expert":
            bombCount = 50; 
            size = 20;
            break;
    }

    const timer = document.getElementById("time");
    clearInterval(timerInterval);
    timer.innerHTML = "00:00";

    resetGame();
}

const startTimer = () => {
    const timer = document.getElementById("time");

    const start = Date.now();
    timerInterval = setInterval(function() {
        let secondsElapsed = Math.floor((Date.now() - start) / 1000); 
        let minutes = Math.floor(secondsElapsed / 60);
        let seconds = secondsElapsed % 60;

        timer.textContent = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }, 200);
}

createGrid();