document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.whiteboard-container');
    
    // Responsive canvas
    const resizeCanvas = () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Variables
    let isDrawing = false;
    let isErasing = false;
    let penColor = 'black';
    let penSize = 5;
    let eraserSize = 20;

    // Drawing functions
    const startDrawing = (x, y) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (x, y) => {
        if (!isDrawing) return;

        ctx.lineWidth = penSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = penColor;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const erase = (x, y) => {
        ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.closePath();
    };

    // Event listeners for drawing
    canvas.addEventListener('mousedown', (e) => {
        const { offsetX, offsetY } = e;
        isErasing ? erase(offsetX, offsetY) : startDrawing(offsetX, offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
        const { offsetX, offsetY } = e;
        isErasing ? erase(offsetX, offsetY) : draw(offsetX, offsetY);
    });

    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        const { clientX, clientY } = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        isErasing ? erase(x, y) : startDrawing(x, y);
    });

    canvas.addEventListener('touchmove', (e) => {
        const { clientX, clientY } = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        isErasing ? erase(x, y) : draw(x, y);
    });

    canvas.addEventListener('touchend', stopDrawing);

    // Controls
    document.getElementById('clearBoard').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('eraseMode').addEventListener('click', () => {
        isErasing = !isErasing;
        document.getElementById('eraseMode').textContent = isErasing ? 'Draw' : 'Erase';
    });

    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorDisplay = document.getElementById('selectedColor');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            penColor = option.getAttribute('data-color');
            selectedColorDisplay.textContent = penColor.charAt(0).toUpperCase() + penColor.slice(1);
        });
    });

    // Pen size
    document.getElementById('penSize').addEventListener('input', (e) => {
        penSize = e.target.value;
        document.getElementById('penSizeValue').textContent = penSize;
    });

    // Eraser size
    document.getElementById('eraserSize').addEventListener('input', (e) => {
        eraserSize = e.target.value;
        document.getElementById('eraserSizeValue').textContent = eraserSize;
    });
});
