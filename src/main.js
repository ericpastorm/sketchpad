import './style.css';
import domtoimage from 'dom-to-image-more';
import { createIcons, Pencil, Palette, Eraser, Download, PaintBucket, Grid3x3, Trash2, Maximize, Check, Circle, CheckCircle } from 'lucide';

createIcons({ icons: { Pencil, Palette, Eraser, Download, PaintBucket, Grid3x3, Trash2, Maximize, Check, Circle, CheckCircle } });

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELECCIÓN DE ELEMENTOS ---
    const gridDiv = document.querySelector(".gridDiv");
    const toolButtons = document.querySelectorAll('.tool-btn');
    const drawBtn = document.querySelector("#draw");
    const eraseBtn = document.querySelector("#erase");
    const bucketBtn = document.querySelector("#bucket-btn");
    const paletteBtn = document.querySelector('#random');
    const colorSubmenu = document.querySelector('#color-submenu');
    const colorSwatches = colorSubmenu.querySelectorAll('button');
    const sizeInput = document.querySelector('#grid-size-input');
    const resizeBtn = document.querySelector("#resize");
    const toggleGridBtn = document.querySelector('#toggle-grid');
    const resetBtn = document.querySelector("#reset");
    const exportBtn = document.querySelector('#export-btn');
    const brushSizeInput = document.querySelector("#brush-size-input");
    const brushSizeLabel = document.querySelector("#brush-size-label");
    const confirmationModal = document.querySelector('#confirmation-modal');
    const cancelResetBtn = document.querySelector('#cancel-reset');
    const confirmResetBtn = document.querySelector('#confirm-reset');
    const successModal = document.querySelector('#success-modal');
    const closeSuccessBtn = document.querySelector('#close-success');

    // --- 2. VARIABLES DE ESTADO ---
    let activeTool = 'draw';
    let pencilColor = '#2f3542';
    let isDrawing = false;
    let sizeGrid = 16;
    let brushSize = 1;
    let gridCellsMatrix = [];

    // --- 3. INICIALIZACIÓN DE VALORES ---
    sizeInput.value = sizeGrid;
    brushSizeLabel.textContent = brushSize;

    // --- 4. FUNCIONES PRINCIPALES ---

    function applyBrush(row, col) {
        const halfBrush = Math.floor(brushSize / 2);
        // Bucle para el área del pincel
        for (let r = row - halfBrush; r < row + brushSize - halfBrush; r++) {
            for (let c = col - halfBrush; c < col + brushSize - halfBrush; c++) {
                if (gridCellsMatrix[r] && gridCellsMatrix[r][c]) {
                    const cell = gridCellsMatrix[r][c];
                    if (activeTool === 'draw') {
                        cell.style.backgroundColor = (pencilColor === 'random') ? randomColor() : pencilColor;
                    } else if (activeTool === 'erase') {
                        cell.style.backgroundColor = 'white';
                    }
                }
            }
        }
    }

    function fillGrid() {
        const fillColor = (pencilColor === 'random') ? randomColor() : pencilColor;
        gridCellsMatrix.forEach(row => {
            row.forEach(cell => {
                cell.style.backgroundColor = fillColor;
            });
        });
    }

    function updateSelectedTool(selectedButton) {
        toolButtons.forEach(button => {
            const ringColor = button.dataset.ringColor;
            if (ringColor) button.classList.remove('ring-2', ringColor);
        });
        if (selectedButton) {
            const ringColor = selectedButton.dataset.ringColor;
            if (ringColor) selectedButton.classList.add('ring-2', ringColor);
        }
    }

    function updateSelectedColor(selectedSwatch) {
        colorSwatches.forEach(swatch => {
            swatch.classList.remove('border-white');
            swatch.classList.add('border-transparent');
        });
        if (selectedSwatch) {
            selectedSwatch.classList.add('border-white');
            selectedSwatch.classList.remove('border-transparent');
        }
    }

    function createGrid(size = 16) {
        gridDiv.innerHTML = '';
        gridCellsMatrix = [];
        gridDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gridDiv.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        for (let r = 0; r < size; r++) {
            gridCellsMatrix[r] = [];
            for (let c = 0; c < size; c++) {
                const div = document.createElement("div");
                div.classList.add('border', 'border-slate-100');
                div.style.backgroundColor = 'white';
                div.dataset.row = r;
                div.dataset.col = c;
                gridDiv.appendChild(div);
                gridCellsMatrix[r][c] = div;
            }
        }
    }

    function randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function showConfirmationModal() {
        confirmationModal.classList.add('show');
        setTimeout(() => cancelResetBtn.focus(), 100);
    }

    function hideConfirmationModal() {
        confirmationModal.classList.remove('show');
    }

    function resetCanvas() {
        createGrid(sizeGrid);
        hideConfirmationModal();
    }

    function showSuccessModal() {
        successModal.classList.add('show');
        setTimeout(() => closeSuccessBtn.focus(), 100);
    }

    function hideSuccessModal() {
        successModal.classList.remove('show');
    }

    function getCellFromPoint(x, y) {
        const rect = gridDiv.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        
        const cellWidth = rect.width / sizeGrid;
        const cellHeight = rect.height / sizeGrid;
        
        const col = Math.floor(relativeX / cellWidth);
        const row = Math.floor(relativeY / cellHeight);
        
        if (row >= 0 && row < sizeGrid && col >= 0 && col < sizeGrid) {
            return gridCellsMatrix[row][col];
        }
        return null;
    }

    // --- 5. EVENT LISTENERS ---

    // Mouse events
    gridDiv.addEventListener('mousedown', (e) => {
        if (activeTool === 'bucket') {
            fillGrid();
            return;
        }
        const cell = e.target.closest('div[data-row]');
        if (cell) {
            isDrawing = true;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            applyBrush(row, col);
        }
    });

    gridDiv.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    gridDiv.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    gridDiv.addEventListener('mouseover', (e) => {
        if (isDrawing) {
            const cell = e.target.closest('div[data-row]');
            if (cell) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                applyBrush(row, col);
            }
        }
    });
    window.addEventListener('mouseup', () => { isDrawing = false; });

    // Touch events for mobile support
    gridDiv.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        if (activeTool === 'bucket') {
            fillGrid();
            return;
        }
        
        const touch = e.touches[0];
        const cell = getCellFromPoint(touch.clientX, touch.clientY);
        if (cell) {
            isDrawing = true;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            applyBrush(row, col);
        }
    });

    gridDiv.addEventListener('touchmove', (e) => {
        e.preventDefault(); 
        if (isDrawing) {
            const touch = e.touches[0];
            const cell = getCellFromPoint(touch.clientX, touch.clientY);
            if (cell) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                applyBrush(row, col);
            }
        }
    });

    gridDiv.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDrawing = false;
    });

    gridDiv.addEventListener('touchend', (e) => {
        e.preventDefault();
    }, { passive: false });

    brushSizeInput.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        brushSizeLabel.textContent = brushSize;
        
        const progress = ((brushSize - 1) / 9) * 100; 
        e.target.style.setProperty('--progress', `${progress}%`);
    });

    sizeInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1 || value > 100) {
            e.target.classList.add('invalid');
        } else {
            e.target.classList.remove('invalid');
        }
    });

    drawBtn.addEventListener('click', () => {
        activeTool = 'draw';
        updateSelectedTool(drawBtn);
        gridDiv.className = gridDiv.className.replace(/cursor-\w+/g, '') + ' cursor-pencil';
    });

    eraseBtn.addEventListener('click', () => {
        activeTool = 'erase';
        updateSelectedTool(eraseBtn);
        gridDiv.className = gridDiv.className.replace(/cursor-\w+/g, '') + ' cursor-eraser';
    });

    bucketBtn.addEventListener('click', () => {
        activeTool = 'bucket';
        updateSelectedTool(bucketBtn);
        gridDiv.className = gridDiv.className.replace(/cursor-\w+/g, '') + ' cursor-bucket';
    });
    
    paletteBtn.addEventListener('click', () => {
        const isVisible = colorSubmenu.classList.contains('show');
        
        if (isVisible) {
            colorSubmenu.classList.remove('show');
            colorSubmenu.classList.add('hide');
            
            setTimeout(() => {
                colorSubmenu.classList.remove('hide');
            }, 300);
        } else {
            colorSubmenu.classList.remove('hide');
            colorSubmenu.classList.add('show');
        }
    });

    colorSubmenu.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        updateSelectedColor(target);
        if (target.dataset.color) {
            pencilColor = target.dataset.color;
        } else if (target.id === 'random-color-btn') {
            pencilColor = 'random';
        }
    });

    resizeBtn.addEventListener('click', () => {
        const newSize = parseInt(sizeInput.value);
        if (!isNaN(newSize) && newSize >= 1 && newSize <= 100) {
            sizeGrid = newSize;
            createGrid(sizeGrid);
            sizeInput.classList.remove('invalid');
        } else {
            sizeInput.classList.add('invalid');
            sizeInput.value = sizeGrid;
        }
        setTimeout(() => e.target.closest('button').blur(), 250); 
    });

    resetBtn.addEventListener('click', () => {
        showConfirmationModal();
    });

    cancelResetBtn.addEventListener('click', () => {
        hideConfirmationModal();
    });

    confirmResetBtn.addEventListener('click', () => {
        resetCanvas();
    });

    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            hideConfirmationModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && confirmationModal.classList.contains('show')) {
            hideConfirmationModal();
        }
        if (e.key === 'Escape' && successModal.classList.contains('show')) {
            hideSuccessModal();
        }
    });

    closeSuccessBtn.addEventListener('click', () => {
        hideSuccessModal();
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            hideSuccessModal();
        }
    });

    toggleGridBtn.addEventListener('click', () => {
        gridDiv.classList.toggle('no-borders');
    });
    exportBtn.addEventListener('click', () => {
    const node = gridDiv;
    const options = {
        quality: 0.95,
        bgcolor: '#ffffff'
    };

    domtoimage.toPng(node, options)
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'my-draw-sketchpad.png';
            link.click();
            
            showSuccessModal();
        })
        .catch(function (error) {
            console.error('There was an error exporting:', error);
            alert('Sorry, the image could not be exported.');
        });
});

    // --- 6. ESTADO INICIAL ---
    createGrid(sizeGrid);
    updateSelectedTool(drawBtn);
    gridDiv.classList.add('cursor-pencil');
    
    colorSubmenu.classList.remove('default-open');
    colorSubmenu.classList.add('show');
    
    const initialProgress = ((brushSize - 1) / 9) * 100;
    brushSizeInput.style.setProperty('--progress', `${initialProgress}%`);
});