let createGrid = () => {
    const table = document.getElementsByTagName("table")[0];
    for (let i = 0; i < 16; i++){
        const row = document.createElement("tr");
        for (let j = 0; j < 16; j++){
            const cell = document.createElement("td");
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

createGrid();