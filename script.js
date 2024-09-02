// script.js
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const modeSelection = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const playMultiplayerButton = document.getElementById('play-multiplayer');
const playComputerButton = document.getElementById('play-computer');

let currentPlayer = 'x'; // 'x' always starts
let board = [];
let isAgainstComputer = false;

function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.addEventListener('click', handleClick, { once: true });
    });
    currentPlayer = 'x';
}

function handleClick(event) {
    const index = event.target.dataset.index;

    if (board[index] || checkWinner()) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer);

    if (checkWinner()) {
        setTimeout(() => alert(`${currentPlayer.toUpperCase()} wins!`), 10);
    } else if (board.every(cell => cell)) {
        setTimeout(() => alert("It's a draw!"), 10);
    } else {
        if (isAgainstComputer) {
            currentPlayer = 'o'; // Switch to computer's turn
            setTimeout(computerMove, 500); // Computer moves after a short delay
        } else {
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        }
    }
}

function computerMove() {
    let bestMove = getWinningMove('o') || getWinningMove('x') || getRandomMove();
    if (bestMove !== null) {
        board[bestMove] = 'o';
        cells[bestMove].textContent = 'o';
        cells[bestMove].classList.add('o');
    }

    if (checkWinner()) {
        setTimeout(() => alert("Computer wins!"), 10);
    } else if (board.every(cell => cell)) {
        setTimeout(() => alert("It's a draw!"), 10);
    } else {
        currentPlayer = 'x'; // Switch back to human's turn
    }
}

function getWinningMove(symbol) {
    // Check for a winning move for the given symbol
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === symbol && board[b] === symbol && board[c] === '') return c;
        if (board[a] === symbol && board[b] === '' && board[c] === symbol) return b;
        if (board[a] === '' && board[b] === symbol && board[c] === symbol) return a;
    }
    return null;
}

function getRandomMove() {
    let availableCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);
    if (availableCells.length > 0) {
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    return null;
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function resetGame() {
    initGame();
}

function startMultiplayer() {
    isAgainstComputer = false;
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    initGame();
}

function startComputerGame() {
    isAgainstComputer = true;
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    initGame();
}

playMultiplayerButton.addEventListener('click', startMultiplayer);
playComputerButton.addEventListener('click', startComputerGame);
resetButton.addEventListener('click', resetGame);
