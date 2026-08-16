/**
 * Chess Game Application Logic
 * Author: S. Vignesh (Developer)
 * Tier 1 Beginner Project
 */

const PIECES = {
  wP: '♙', wR: '♖', wN: '♘', wB: '♗', wQ: '♕', wK: '♔',
  bP: '♟', bR: '♜', bN: '➞', bB: '♝', bQ: '♛', bK: '♚'
};

const INITIAL_BOARD = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
];

let board = JSON.parse(JSON.stringify(INITIAL_BOARD));
let turn = 'w';
let selectedSquare = null;
let history = [];
let capturedWhite = [];
let capturedBlack = [];

const boardElement = document.getElementById('chess-board');
const turnIndicator = document.getElementById('turn-indicator');
const moveHistoryElem = document.getElementById('move-history');
const capturedWhiteElem = document.getElementById('captured-white');
const capturedBlackElem = document.getElementById('captured-black');

function renderBoard() {
  boardElement.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.createElement('div');
      const isLight = (r + c) % 2 === 0;
      square.className = `square ${isLight ? 'light' : 'dark'}`;
      square.dataset.row = r;
      square.dataset.col = c;

      const pieceCode = board[r][c];
      if (pieceCode) {
        square.textContent = PIECES[pieceCode] || pieceCode;
      }

      if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
        square.classList.add('selected');
      }

      square.addEventListener('click', () => handleSquareClick(r, c));
      boardElement.appendChild(square);
    }
  }

  updateTurnUI();
}

function handleSquareClick(r, c) {
  const clickedPiece = board[r][c];

  if (selectedSquare) {
    if (selectedSquare.r === r && selectedSquare.c === c) {
      selectedSquare = null;
      renderBoard();
      return;
    }

    if (clickedPiece && clickedPiece.startsWith(turn)) {
      selectedSquare = { r, c };
      renderBoard();
      return;
    }

    // Execute Move
    executeMove(selectedSquare.r, selectedSquare.c, r, c);
    selectedSquare = null;
    renderBoard();
  } else {
    if (clickedPiece && clickedPiece.startsWith(turn)) {
      selectedSquare = { r, c };
      renderBoard();
    }
  }
}

function executeMove(fromR, fromC, toR, toC) {
  const movingPiece = board[fromR][fromC];
  const targetPiece = board[toR][toC];

  history.push({
    board: JSON.parse(JSON.stringify(board)),
    turn,
    capturedWhite: [...capturedWhite],
    capturedBlack: [...capturedBlack]
  });

  if (targetPiece) {
    if (targetPiece.startsWith('w')) capturedWhite.push(PIECES[targetPiece]);
    else capturedBlack.push(PIECES[targetPiece]);
  }

  board[toR][toC] = movingPiece;
  board[fromR][fromC] = '';

  const moveStr = `${movingPiece} to (${toR + 1},${toC + 1})`;
  const log = document.createElement('div');
  log.textContent = `${history.length}. ${moveStr}`;
  moveHistoryElem.appendChild(log);
  moveHistoryElem.scrollTop = moveHistoryElem.scrollHeight;

  turn = turn === 'w' ? 'b' : 'w';
  updateCapturedUI();
}

function updateTurnUI() {
  if (turn === 'w') {
    turnIndicator.innerHTML = 'Current Turn: <span class="white-text">White ⚪</span>';
  } else {
    turnIndicator.innerHTML = 'Current Turn: <span class="black-text">Black 🔴</span>';
  }
}

function updateCapturedUI() {
  capturedWhiteElem.textContent = capturedWhite.join(' ');
  capturedBlackElem.textContent = capturedBlack.join(' ');
}

document.getElementById('btn-reset').addEventListener('click', () => {
  board = JSON.parse(JSON.stringify(INITIAL_BOARD));
  turn = 'w';
  selectedSquare = null;
  history = [];
  capturedWhite = [];
  capturedBlack = [];
  moveHistoryElem.innerHTML = '';
  updateCapturedUI();
  renderBoard();
});

document.getElementById('btn-undo').addEventListener('click', () => {
  if (history.length === 0) return;
  const lastState = history.pop();
  board = lastState.board;
  turn = lastState.turn;
  capturedWhite = lastState.capturedWhite;
  capturedBlack = lastState.capturedBlack;
  if (moveHistoryElem.lastChild) {
    moveHistoryElem.removeChild(moveHistoryElem.lastChild);
  }
  updateCapturedUI();
  renderBoard();
});

// Initial Render
renderBoard();
