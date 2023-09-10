const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentTool = 'pencil';
let currentColor = '#000000';
let drawing = false;
let lastX = 0;
let lastY = 0;
let undoStack = [];
let redoStack = [];

function setTool(tool) {
	currentTool = tool;
}

function setColor(color) {
	currentColor = color;
}

function startDrawing(e) {
	drawing = true;
	lastX = e.offsetX;
	lastY = e.offsetY;
	undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
	redoStack = [];
}

function draw(e) {
	if (!drawing) return;
	switch (currentTool) {
		case 'pencil':
			drawLine(e);
			break;
		case 'brush':
			drawLine(e, true);
			break;
		case 'rect':
			drawRect(e);
			break;
		case 'circle':
			drawCircle(e);
			break;
		default:
			break;
	}
}

function endDrawing() {
	drawing = false;
}

function drawLine(e, isBrush = false) {
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.strokeStyle = currentColor;
	ctx.lineWidth = isBrush ? 5 : 1;
	ctx.stroke();
	lastX = e.offsetX;
	lastY = e.offsetY;
}

function drawRect(e) {
	ctx.fillStyle = currentColor;
	ctx.fillRect(lastX, lastY, e.offsetX - lastX, e.offsetY - lastY);
}

function drawCircle(e) {
	const radius = Math.sqrt(Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2));
	ctx.beginPath();
	ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
	ctx.fillStyle = currentColor;
	ctx.fill();
}

function undo() {
	if (undoStack.length > 1) {
		redoStack.push(undoStack.pop());
		ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
	}
}

function redo() {
	if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
        }
        }
        
        function save() {
        const image = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = image;
        link.download = 'image.png';
        link.click();
        }
        
        function importImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function() {
        const image = new Image();
        image.onload = function() {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        redoStack = [];
        };
        image.src = reader.result;
        };
        reader.readAsDataURL(file);
        }
        
        function exportImage() {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'image.png';
        link.click();
        }
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mouseout', endDrawing);
        
        document.getElementById('pencil').addEventListener('click', function() { setTool('pencil'); });
        document.getElementById('brush').addEventListener('click', function() { setTool('brush'); });
        document.getElementById('rect').addEventListener('click', function() { setTool('rect'); });
        document.getElementById('circle').addEventListener('click', function() { setTool('circle'); });
        document.getElementById('color').addEventListener('change', function() { setColor(this.value); });
        document.getElementById('undo').addEventListener('click', undo);
        document.getElementById('redo').addEventListener('click', redo);
        document.getElementById('save').addEventListener('click', save);
        document.getElementById('import').addEventListener('change', importImage);
        document.getElementById('export').addEventListener('click', exportImage);
