const matrixSize = 19;
const printCount = document.querySelector('.count');
const bestScoreDiv = document.querySelector('.best_score');
const snakeWrapper = document.querySelector('.snake_parent_wrapper');
const startAgainIcon = document.querySelector('.fas');
const buttons = document.querySelectorAll('.button');
const startButtons = document.querySelectorAll('.choose_level');
const overlay = document.querySelector('.overlay');
const startMenu = document.querySelector('.start_game');
const pointsPerLevel = {
  easy: 1,
  medium: 2,
  hard: 3,
};
const snakeIntervalPerLevel = { easy: 135, medium: 95, hard: 60 };
const snakeBodyColor = 'rgba(0,0,0,.75)';
const fieldBackgroundColor = '#9bba5a';
let pointToAdd;
let count = 0;
let bestScore = 0;
let position; // actual position of the last snake bite(element)
let foodEaten = false;
let currentDirection = 'down';
let mainInterval;
let currentMove = moveTo('down'); // initial function to move snake
let snakeInterval = 105; // interval to move snake
let matrixDOM = [];
let actualSnake = [];
let currentFoodPosition;

// Event Listeners
document.addEventListener('DOMContentLoaded', onInit);
startAgainIcon.addEventListener('click', startAgain);
document.addEventListener('keydown', onKeyPress);
mobileButtonsHandle();

// Initialize Game
createMatrix();
actualSnake = [matrixDOM[1][5], matrixDOM[2][5], matrixDOM[3][5]];
currentFoodPosition = getFoodPosition();
adjustWrapperWidth();
printSnake();

// Functions
function mobileButtonsHandle() {
  startButtons.forEach((button) => button.addEventListener('click', chooseLevelHandler));
  buttons.forEach((button) => button.addEventListener('touchend', onKeyPress));
}

function onInit() {
  const storedBestScore = localStorage.getItem('bestScore');
  if (storedBestScore) {
    bestScore = parseInt(storedBestScore, 10);
    bestScoreDiv.innerHTML = bestScore;
  }
}

function startGame() {
  findPosition();
  mainInterval = setInterval(() => {
    findPosition();
    currentMove();
  }, snakeInterval);
}

function getFoodPosition() {
  const size = matrixSize - 1;
  let y, x;
  const createRand = () => {
    y = Math.floor(Math.random() * size) + 1;
    x = Math.floor(Math.random() * size) + 1;
  };
  createRand();
  checkFoodPosition();
  function checkFoodPosition() {
    actualSnake.forEach((el) => {
      if (el === matrixDOM[y][x]) {
        createRand();
        checkFoodPosition();
      }
    });
  }
  matrixDOM[y][x].classList.add('food_cell');
  return matrixDOM[y][x];
}

function clear() {
  matrixDOM.forEach((row) => {
    row.forEach((cell) => {
      if (cell !== currentFoodPosition) {
        cell.style.backgroundColor = fieldBackgroundColor;
      }
    });
  });
}

function printSnake() {
  matrixDOM.forEach((row) => {
    row.forEach((cell) => {
      actualSnake.forEach((bite) => {
        if (cell === bite) {
          cell.style.backgroundColor = snakeBodyColor;
        }
      });
    });
  });
}

function getNextCell() {
  let newPosition;
  switch (currentDirection) {
    case 'down':
      newPosition = position[0] === matrixDOM.length - 1 ? 0 : position[0] + 1;
      return matrixDOM[newPosition][position[1]];
    case 'right':
      newPosition = position[1] === matrixDOM[position[0]].length - 1 ? 0 : position[1] + 1;
      return matrixDOM[position[0]][newPosition];
    case 'left':
      newPosition = position[1] === 0 ? matrixDOM[position[0]].length - 1 : position[1] - 1;
      return matrixDOM[position[0]][newPosition];
    case 'up':
      newPosition = position[0] === 0 ? matrixDOM.length - 1 : position[0] - 1;
      return matrixDOM[newPosition][position[1]];
    default:
      return;
  }
}

function endGame() {
  clearInterval(mainInterval);
  overlay.style.display = 'flex';
  snakeWrapper.classList.add('shake');
  const oldBestScore = localStorage.getItem('bestScore');
  if (oldBestScore && oldBestScore < bestScore) {
    localStorage.setItem('bestScore', bestScore);
  }
}

function moveTo(direction) {
  return function move() {
    currentDirection = direction;
    clear();
    const nextCell = getNextCell();
    actualSnake.forEach((el) => {
      if (nextCell === el) {
        endGame();
      }
    });
    if (foodEaten) {
      actualSnake.push(nextCell);
      count += pointToAdd;
      if (count > bestScore) {
        bestScore = count;
      }
      bestScoreDiv.innerHTML = bestScore;
      printCount.innerHTML = count;
      foodEaten = false;
    } else {
      moveSnake(nextCell);
    }
    printSnake();
  };
}

function moveSnake(nextCell) {
  if (nextCell.classList.contains('food_cell')) {
    foodEaten = true;
    actualSnake.push(nextCell);
    actualSnake.shift();
    currentFoodPosition.classList.remove('food_cell');
    currentFoodPosition = getFoodPosition();
  } else {
    actualSnake.push(nextCell);
    actualSnake.shift();
  }
}

function findPosition() {
  matrixDOM.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === actualSnake[actualSnake.length - 1]) {
        position = [rowIndex, cellIndex];
      }
    });
  });
  return position;
}

function createMatrix() {
  for (let i = 0; i < matrixSize; i++) {
    matrixDOM.push([]);
    for (let j = 0; j < matrixSize; j++) {
      const newSnakeBite = document.createElement('div');
      newSnakeBite.className = 'snake_block_wrapper';
      snakeWrapper.appendChild(newSnakeBite);
      matrixDOM[i].push(newSnakeBite);
    }
  }
}

function chooseLevelHandler(e) {
  const level = e.target.classList[0];
  switch (level) {
    case 'easy':
      snakeInterval = snakeIntervalPerLevel.easy;
      pointToAdd = pointsPerLevel.easy;
      break;
    case 'medium':
      snakeInterval = snakeIntervalPerLevel.medium;
      pointToAdd = pointsPerLevel.medium;
      break;
    case 'hard':
      snakeInterval = snakeIntervalPerLevel.hard;
      pointToAdd = pointsPerLevel.hard;
      break;
    default:
      break;
  }
  startMenu.style.display = 'none';
  startGame();
}

function onKeyPress(e) {
  const key = e.key || e.target.classList[0];
  switch (key) {
    case 'ArrowDown':
    case 'button_down':
      if (currentDirection !== 'up') currentMove = moveTo('down');
      break;
    case 'ArrowRight':
    case 'button_right':
      if (currentDirection !== 'left') currentMove = moveTo('right');
      break;
    case 'ArrowLeft':
    case 'button_left':
      if (currentDirection !== 'right') currentMove = moveTo('left');
      break;
    case 'ArrowUp':
    case 'button_up':
      if (currentDirection !== 'down') currentMove = moveTo('up');
      break;
    default:
      return;
  }
}

function startAgain() {
  actualSnake = [matrixDOM[1][5], matrixDOM[2][5], matrixDOM[3][5]];
  clear();
  printSnake();
  overlay.style.display = 'none';
  snakeWrapper.classList.remove('shake');
  currentDirection = 'down';
  currentMove = moveTo('down');
  startMenu.style.display = 'block';
  count = 0;
  printCount.innerHTML = count;
}

function adjustWrapperWidth() {
  const windowWidth = window.innerWidth;
  if (windowWidth <= 992) {
    snakeWrapper.style.width = matrixSize * 14 + 8 + 'px';
  } else {
    snakeWrapper.style.width = matrixSize * 28 + 8 + 'px';
  }
}
