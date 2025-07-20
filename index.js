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

            cell.addEventListener("contextmenu", (e) => placeFlag(e, i, j)); // event listeners for mouse events
            cell.addEventListener("mousedown", (e) => handleMouseDown(e, i, j)); 
            cell.addEventListener("mouseup", (e) => handleMouseUp(e, i, j));
            cell.addEventListener("mouseleave", () => handleMouseLeave());

            cell.addEventListener("touchstart", (e) => handleTouchStart(e, i, j)); // event listeners for touch events
            cell.addEventListener("touchend", (e) => handleTouchEnd(e, i, j));

            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    setCellHeights();

    const bombCounter = document.getElementsByTagName("span")[0];
    bombCounter.innerHTML = bombCount;

    const timerText = document.getElementById("time");
    timerText.innerHTML = "00:00";

    const gameMode = document.getElementsByName("game-mode");
    for (let i = 0; i < gameMode.length; i++){
        gameMode[i].addEventListener("click", changeSize);
    }

    placeMines();
    setBombCounts();
};

const handleMouseDown = (e, i, j) => {
    if (e.button !== 0) return;
    isLongClick = false;
    timer = setTimeout(() => {
        isLongClick = true;
        placeFlag(e, i, j);
    }, threshold);
};

const handleMouseUp = (e, i, j) => {
    if (e.button !== 0) return;
    if (timer) {
        clearTimeout(timer);
        if (!isLongClick) {
            revealCell(i, j);
        }
    }
};

const handleMouseLeave = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const handleTouchStart = (e, i, j) => {
    e.preventDefault();
    isLongClick = false;
    flagPressed = false;
    timer = setTimeout(() => {
        isLongClick = true;
        placeFlag(e, i, j);
        flagPressed = true;
    }, threshold);
};

const handleTouchEnd = (e, i, j) => {
    e.preventDefault();
    if (timer) {
        clearTimeout(timer);
        if (!isLongClick && !flagPressed) {
            revealCell(i, j);
        }
    }
};

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
};

const setBombCounts = () => {
    const gameGrid = document.getElementById("game-grid");
    const rows = gameGrid.children;

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
};

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
};

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
};

const gameOver = (cellClicked) => {
    cellClicked.classList.add("bomb");
    cellClicked.style.backgroundColor = "red";

    var explosionSound = new Audio("./sounds/explosion.mp3");
    explosionSound.play();

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

    revealedCells = 0;
    flagsPlaced = 0;

    const modal = document.getElementsByClassName("modal")[0];
    modal.style.display = "block";

    document.addEventListener("click", resetGameLostHandler);

    clearInterval(timerInterval);
    timerInterval = null;
};

const gameWon = () => {
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            const row = document.getElementsByTagName("tr")[i];
            const cell = row.getElementsByTagName("td")[j];
            cell.replaceWith(cell.cloneNode(true)); //removing all event listeners 
        }
    }

    const modal = document.getElementsByClassName("modal")[1];
    modal.style.display = "block";

    document.addEventListener("click", resetGameWinHandler);

    revealedCells = 0;
    flagsPlaced = 0;

    clearInterval(timerInterval);
    timerInterval = null;
};

const resetGameLostHandler = (e) => {
    const lostModal = document.getElementsByClassName("game-over")[0]; 
    const lostCloseButton = document.getElementsByClassName("close")[0];
    const playAgainLost = document.getElementById("play-again-lost");

    if (!lostModal.contains(e.target) || e.target === lostCloseButton || e.target === playAgainLost) {
        document.removeEventListener("click", resetGameLostHandler);
        resetGame();
    }
};

const resetGameWinHandler = (e) => {
    const wonModal = document.getElementsByClassName("game-win")[0]; 
    const wonCloseButton = document.getElementsByClassName("close")[1];
    const playAgainWon = document.getElementById("play-again-won");

    if (!wonModal.contains(e.target) || e.target === wonCloseButton || e.target === playAgainWon) {
        document.removeEventListener("click", resetGameWinHandler);
        resetGame();
    }
};

const resetGame = () => {
    const lostModal = document.getElementsByClassName("modal")[0];
    lostModal.style.display = "none";

    const wonModal = document.getElementsByClassName("modal")[1];
    wonModal.style.display = "none";

    const table = document.getElementsByTagName("table")[0];
    table.innerHTML = "";
    createGrid();

    joinLeaderboard.joined = false;

    const errorMessage = document.getElementsByClassName("error")[0];
    errorMessage.classList.remove("show");

    usernameField.classList.remove("disabled");
    usernameField.removeAttribute("disabled");

    revealedCells = 0;
    flagsPlaced = 0;
};

const changeSize = () => {
    const selectedMode = document.querySelector('input[name="game-mode"]:checked').value;
    switch (selectedMode){
        case "beginner":
            bombCount = 10; 
            size = 9;
            break;
        case "intermediate":
            bombCount = 30; 
            size = 16;
            break; 
        case "expert":
            bombCount = 50; 
            size = 20;
            break;
    }

    const timerText = document.getElementById("time");
    clearInterval(timerInterval);
    timerText.innerHTML = "00:00";

    const gameGrid = document.getElementById("game-grid");
    const gameModes = ["beginner", "intermediate", "expert"];
    gameModes.forEach((gameMode) => {
        gameGrid.classList.remove(gameMode);
    })

    gameGrid.classList.add(selectedMode);

    resetGame();
};

const startTimer = () => {
    const timerText = document.getElementById("time");

    const start = Date.now();
    timerInterval = setInterval(function() {
        let secondsElapsed = Math.floor((Date.now() - start) / 1000); 
        let minutes = Math.floor(secondsElapsed / 60);
        let seconds = secondsElapsed % 60;

        timerText.textContent = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }, 200);
};

const displayRules = () => {
    const modal = document.getElementsByClassName("modal")[2];
    modal.style.display = "block";

    document.addEventListener("click", hideRulesHandler);
};

const hideRulesHandler = (e) => {
    const modal = document.getElementById("rules"); 
    const closeButton = document.getElementsByClassName("close")[2];

    if (e.target !== viewRules && (!modal.contains(e.target) || e.target === closeButton)) { 
        hideRules(); 
    }
};

const hideRules = () => {
    const modal = document.getElementsByClassName("modal")[2];
    modal.style.display = "none";

    document.removeEventListener("click", hideRules);
};

const displayLeaderboard = () => {
    const modal = document.getElementsByClassName("modal")[3];
    modal.style.display = "block";

    let gameMode = document.querySelector('input[name="game-mode"]:checked').value;

    const leaderboardGameMode = document.getElementById("leaderboard-game-mode");
    leaderboardGameMode.innerHTML = gameMode; 

    let results = getLeaderboard(gameMode);

    document.addEventListener("click", hideLeaderboardHandler);
};

const hideLeaderboardHandler = (e) => {
    const modal = document.getElementById("leaderboard"); 
    const closeButton = document.getElementsByClassName("close")[3];

    if (e.target !== viewLeaderboard && (!modal.contains(e.target) || e.target === closeButton)) { 
        hideLeaderboard(); 
    }
};

const hideLeaderboard = () => {
    const modal = document.getElementsByClassName("modal")[3];
    modal.style.display = "none";

    document.removeEventListener("click", hideLeaderboard);

    const leaderboardTable = document.getElementsByTagName("table")[1];

    while (leaderboardTable.children.length > 1){
        leaderboardTable.removeChild(leaderboardTable.lastElementChild);
    }
};

const getLeaderboard = async (gameMode) => {
    const { data, error } = await supabaseClient.from("Leaderboard").select().eq("gameMode", gameMode).order("time", { ascending: true }).limit(10);
    
    const toastConfirmation = document.getElementsByClassName("toast")[0];

    if (error !== null){
        toastConfirmation.innerHTML = "Error retrieving leaderboard.";
        displayToast();
    } else if (data.length === 0){
        toastConfirmation.innerHTML = "No scores found on leaderboard.";
        displayToast(); 
    } else {
        const leaderboardTable = document.getElementsByTagName("table")[1];

        for (i in data){
            let row = document.createElement("tr");

            let td1 = document.createElement("td");
            td1.innerHTML = parseInt(i) + 1; 

            let td2 = document.createElement("td");
            td2.innerHTML = data[i].username; 

            let td3 = document.createElement("td");
            td3.innerHTML = data[i].time; 

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);

            leaderboardTable.appendChild(row);
        }
    }
};

const addScoreToLeaderboard = async () => {
    let gameMode = document.querySelector('input[name="game-mode"]:checked').value;
    let time = document.getElementById("time").innerHTML;
    let username = usernameField.value;
    const toast = document.getElementsByClassName("toast")[0];

    const errorMessage = document.getElementsByClassName("error")[0];

    joinLeaderboard.classList.add("disabled");
    joinLeaderboard.setAttribute("disabled", "true");

    if (username.length === 0){
        errorMessage.classList.add("show");
    } else if (time === "00:00") {
        toast.innerHTML = "Cannot add invalid score to leaderboard.";
        displayToast();
    } else {
        usernameField.classList.add("disabled");
        usernameField.setAttribute("disabled", "true");

        if (joinLeaderboard.joined) {
            toast.innerHTML = "Score already added to leaderboard.";
            displayToast(); 
        } else {
            errorMessage.classList.remove("show");
            joinLeaderboard.classList.add("disabled");
            joinLeaderboard.setAttribute("disabled", "true");
            usernameField.classList.add("disabled");
            usernameField.setAttribute("disabled", "true");
        
            const error = await supabaseClient.from("Leaderboard").insert({ id: undefined, gameMode: gameMode, time: time, username: username });

            joinLeaderboard.joined = true;

            if (error.status === 201){
                toast.innerHTML = "Score added to leaderboard.";
            } else {
                toast.innerHTML = "Error adding score to leaderboard.";
            }

            displayToast();
        } 
    }
};

const displayToast = () => {
    const toastConfirmation = document.getElementsByClassName("toast")[0];

    toastConfirmation.classList.add("show");
    setTimeout(() => {
        toastConfirmation.classList.remove("show"); 
    }, 3000);
}

const checkUsernameInput = () => { 
    const errorMessage = document.getElementsByClassName("error")[0]; 

    if (usernameField.value.length > 0){
        errorMessage.classList.remove("show");
        joinLeaderboard.classList.remove("disabled");
        joinLeaderboard.removeAttribute("disabled");
    } else {
        errorMessage.classList.add("show");
        joinLeaderboard.classList.add("disabled");
        joinLeaderboard.setAttribute("disabled", "true");
    }
};

const checkBrowserWidth = () => {
    const center = document.getElementsByClassName("center")[0];
    const right = document.getElementsByClassName("right")[0];
    const main = document.getElementsByClassName("main")[0];

    if (right.offsetTop > center.offsetTop){
        main.classList.add("flexed");
    } else {
        main.classList.remove("flexed");
    }
};

const setCellHeights = () => {
    const gameGrid = document.getElementById("game-grid");

    let gameGridStyle = window.getComputedStyle(gameGrid);
    gameGrid.style.height = gameGridStyle.width;

    const gridWidth = gameGridStyle.width.replace("px", "");

    const rows = gameGrid.getElementsByTagName("tr");
    Array.from(rows).forEach((row) => {
        row.style.height = `${gridWidth / size}px`;
    });

    if ((gridWidth / size) < 21.5){
        gameGrid.classList.add("small");
        gameGrid.classList.remove("large");
    } else if ((gridWidth / size) > 28) {
        gameGrid.classList.remove("small");
        gameGrid.classList.add("large");
    } else {
        gameGrid.classList.remove("small");
        gameGrid.classList.remove("large");
    }
};

let revealedCells = 0;
let flagsPlaced = 0;
let bombCount = 40; 
let size = 16;
let timerInterval;
let timer;
let isLongClick = false;
let flagPressed = false;
const threshold = 500;

const supabaseClient = supabase.createClient("https://jrqldcefvhfgzzsiaxjl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycWxkY2VmdmhmZ3p6c2lheGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjUyNTQsImV4cCI6MjA2NjcwMTI1NH0.qfqEUYlWtb__k9YnX0CS2szDj3Mb9TzTu-FsfCPJYPc");

const joinLeaderboard = document.getElementById("join-leaderboard");
joinLeaderboard.addEventListener("click", addScoreToLeaderboard);
joinLeaderboard.joined = false;

const viewRules = document.getElementById("view-rules");
viewRules.addEventListener("click", displayRules);

const viewLeaderboard = document.getElementById("view-leaderboard");
viewLeaderboard.addEventListener("click", displayLeaderboard);

const usernameField = document.getElementById("username");
usernameField.addEventListener("input", checkUsernameInput);

createGrid();

checkBrowserWidth();
window.addEventListener("resize", checkBrowserWidth);

window.addEventListener("resize", setCellHeights);