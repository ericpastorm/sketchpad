const gridDiv = document.querySelector(".gridDiv")
let modeDraw = 0;
let sizeGrid = 16;
let isResizing = false;

function drawButton(grid){
    switch (modeDraw) {
        case 0:  
            break;
        case 1:
            grid.style.backgroundColor = '#2f3542';
            break
        case 2:
            grid.style.background = 'white';
            break;
        case 3:
            grid.style.background = randomColor();
            break;
        default:
            break;
    }
}

function selBtns(){
    const resizeBtn = document.querySelector("#resize");
    resizeBtn.addEventListener('click',function (e) {
        resizeGrid(true);
    });
    const drawBtn = document.querySelector("#draw");
    drawBtn.addEventListener('click',function (e) {
        modeDraw = 1;
    });
    const randomBtn = document.querySelector("#random");
    randomBtn.addEventListener('click',function (e) {
        modeDraw = 3;
    });
    const eraseBtn = document.querySelector("#erase");
    eraseBtn.addEventListener('click',function (e) {
        modeDraw = 2;
    });
    const resetBtn = document.querySelector("#reset");
    resetBtn.addEventListener('click',function (e) {
        resizeGrid(false);
    });
}

function resizeGrid(resize = false){
    if (isResizing) return;
    isResizing = true;
    removeGrid();
    if (resize) {
        let newSize = prompt("Select the number of squares per side (1-100):", sizeGrid);
        
        newSize = parseInt(newSize);
        if (!isNaN(newSize) && newSize >= 1 && newSize <= 100) {
          sizeGrid = newSize;
        } else {
          alert("Invalid input. Using previous size.");
        }
    }
    createGrid(sizeGrid, sizeGrid); 
    isResizing = false;
}

function removeGrid(){
    while (gridDiv.firstChild) {
        gridDiv.removeChild(gridDiv.firstChild);
    }
}

function randomColor(){
 let ranR = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
 let ranG = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
 let ranB = Math.floor(Math.random() * (255 - 0 + 1)) + 0;

 return colorRgb = `rgb(${ranR}, ${ranG}, ${ranB})`
}

function createGrid(sizeX = 16, sizeY = 16){
    removeGrid();
    const buttonSize = 600 / sizeX;  

    gridDiv.style.width = `${buttonSize * sizeX}px`;
    gridDiv.style.height = `${buttonSize * sizeY}px`;

    for (let i = 0; i < sizeX * sizeY; i++) {
        const button = document.createElement("button");
        button.classList.add("gridOne");
        button.style.width = `${buttonSize}px`;
        button.style.height = `${buttonSize}px`;
        button.addEventListener("mouseenter", () => drawButton(button));
        gridDiv.appendChild(button);
    }
}

createGrid();
selBtns();