const gridDiv = document.querySelector(".gridDiv")
let modeDraw = 0;

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
        default:
            break;
    }
}

function selBtns(){
    const drawBtn = document.querySelector("#draw");
    drawBtn.addEventListener('click',function (e) {
        modeDraw = 1;
    });
    const eraseBtn = document.querySelector("#erase");
    eraseBtn.addEventListener('click',function (e) {
        modeDraw = 2;
    });
}

function createGrid(sizeX = 16, sizeY = 16){
    selBtns();
    for (let i = 0; i < sizeX; i++) {
        let divSize = +(600/sizeX);
        let gridOne = document.createElement("button");
        gridOne.classList.add("gridOne");
        gridOne.style.height = divSize + 'px';
        gridOne.style.width = divSize + 'px';
        console.log(divSize);
        gridOne.addEventListener('mouseenter',function (e) {
            drawButton(gridOne);
        });
        gridDiv.appendChild(gridOne);
        for (let z = 1; z < sizeY; z++) {
            let gridOne = document.createElement("button");
            gridOne.classList.add("gridOne");
            gridOne.style.height = divSize + 'px';
            gridOne.style.width = divSize + 'px';
            gridOne.addEventListener('mouseenter',function (e) {
                drawButton(gridOne);
            });
            gridDiv.appendChild(gridOne);     
        }
    }
}

createGrid();