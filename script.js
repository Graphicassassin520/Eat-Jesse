const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const difficultySelect = document.getElementById('difficulty');
const gridSizeInput = document.getElementById('gridSize');
const snakeColorInput = document.getElementById('snakeColor');
const upButton = document.getElementById('upButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const downButton = document.getElementById('downButton');
const countdownElement = document.getElementById('countdown');

let gridSize = parseInt(gridSizeInput.value, 10);
let snakeColor = snakeColorInput.value;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: 0, y: 0 };
let food = { x: gridSize * 10, y: gridSize * 10 };
let gameInterval;
let isRunning = false;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore'), 10) : 0;
highScoreDisplay.textContent = highScore;

// Load sound effects
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

// Load Jesse image
const jesseImage = new Image();
jesseImage.src = 'jesse.png'; // Ensure the image file is in the same directory

function drawRect(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x, y, gridSize, gridSize);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function gameLoop() {
    clearCanvas();

    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        isRunning = false;
        gameOverSound.play();
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        alert('Game Over! Your score is ' + score);
        return;
    }

    // Check for food
    if (head.x === food.x && head.y === food.y) {
        snake.push({});
        placeFood();
        score++;
        scoreDisplay.textContent = score;
        eatSound.play();
    }

    // Move snake body
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = { ...snake[i - 1] };
    }

    // Move snake head
    snake[0] = head;

    // Draw food (Jesse)
    context.drawImage(jesseImage, food.x, food.y, gridSize, gridSize);

    // Draw snake
    snake.forEach(segment => drawRect(segment.x, segment.y, snakeColor));
}

function startGame() {
    if (isRunning) return;

    countdownElement.classList.remove('hidden');
    let countdown = 3;
    countdownElement.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownElement.classList.add('hidden');
            beginGame();
        }
    }, 1000);
}

function beginGame() {
    gridSize = parseInt(gridSizeInput.value, 10);
    snakeColor = snakeColorInput.value;
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    scoreDisplay.textContent = score;
    placeFood();
    const speed = parseInt(difficultySelect.value, 10);
    gameInterval = setInterval(gameLoop, speed);
    isRunning = true;
}

function pauseGame() {
    if (isRunning) {
        clearInterval(gameInterval);
        isRunning = false;
        pauseButton.textContent = 'Resume Game';
    } else {
        const speed = parseInt(difficultySelect.value, 10);
        gameInterval = setInterval(gameLoop, speed);
        isRunning = true;
        pauseButton.textContent = 'Pause Game';
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

upButton.addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -gridSize };
});

downButton.addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: gridSize };
});

leftButton.addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -gridSize, y: 0 };
});

rightButton.addEventListener('click', () => {
    if (direction.x === 0) direction = { x: gridSize, y: 0 };
});

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
