// "use strict";

const test = document.querySelector(".test");
let count = 0;

const snakeWrapper = document.querySelector(".snake_parent_wrapper");
const buttons = document.querySelectorAll(".button");
const startButtons = document.querySelectorAll(".choose_level");
const overlay = document.querySelector(".overlay");
const matrixSize = 19;
let position; // actual position of the last snake bite(element)
let eatedFood = false; // snake eated food, we want to use it at next move, to add length to actualSnake;
let currentDirection = "down";
let mainInterval;
let currentMove = moveTo("down"); // initial function to move snake
let snakeInterval = 105; // interval to move snake
let actualSnake = [];
let matrixDOM = [];
createMatrix(); // creating DOM matrix
actualSnake = [matrixDOM[1][5], matrixDOM[2][5], matrixDOM[3][5]]; // setting up the initial snake
document.addEventListener("keydown", onKeyPress); // event listener for key press
let food;
let currentFoodPosition = getFoodposition();
const windowWidt = window.innerWidth;

if (windowWidt <= 992) {
  snakeWrapper.style.width = matrixSize * 14 + 8 + "px"; // 28 + 8
} else {
  snakeWrapper.style.width = matrixSize * 28 + 8 + "px"; //
}
printSnake(); // printing initial snake
mobileButtonsHandle();

function mobileButtonsHandle() {
  for (let i = 0; i < startButtons.length; i++) {
    startButtons[i].addEventListener("click", chooseLevelHandler);
  }
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("touchend", onKeyPress); //touchstart
  }
}

function startGame() {
  findPosition();
  // currentMove();
  mainInterval = setInterval(() => {
    findPosition(); // we can find actual position of the last snake bite(element)
    currentMove(); // here we call current move function in a interval

    // console.log(actualSnake.length);
  }, snakeInterval);
}
function getFoodposition() {
  const size = matrixSize - 1;
  let y;
  let x;
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
        console.log("true first time");
      }
    });
  }

  matrixDOM[y][x].classList.add("food_cell");
  food = [y, x];
  return matrixDOM[y][x];
}
function clear() {
  // console.time("test time");
  matrixDOM.forEach((el) => {
    el.forEach((elem) => {
      // by this if we want to keep our snake food from clearing every time
      if (elem !== currentFoodPosition) {
        elem.style.backgroundColor = "#9bba5a";
        // elem.classList = "snake_block_wapper";
        // elem.style.backgroundImage = "none";
      }
      // "white";
    });
  });
  // console.timeEnd("test time");
}

function printSnake() {
  // console.time("test time");
  matrixDOM.forEach((el, i) => {
    el.forEach((elem, ind) => {
      actualSnake.forEach((bite) => {
        if (elem === bite) {
          elem.style.backgroundColor = "rgba(0,0,0,.75)";
          // elem.classList += "snake";
          // "#af5";
        }
      });
    });
  });
  // console.timeEnd("test time");
}
function getNextCell() {
  let newPosition;
  switch (currentDirection) {
    case "down":
      if (position[0] === matrixDOM.length - 1) {
        newPosition = 0;
      } else {
        newPosition = position[0] + 1;
      }
      return matrixDOM[newPosition][position[1]];
    case "right":
      if (position[1] === matrixDOM[position[0]].length - 1) {
        newPosition = 0;
      } else {
        newPosition = position[1] + 1;
      }
      return matrixDOM[position[0]][newPosition];
    case "left":
      if (position[1] === 0) {
        newPosition = matrixDOM[position[0]].length - 1;
      } else {
        newPosition = position[1] - 1;
      }
      return matrixDOM[position[0]][newPosition];
    case "up":
      if (position[0] === 0) {
        newPosition = matrixDOM.length - 1;
      } else {
        newPosition = position[0] - 1;
      }
      return matrixDOM[newPosition][position[1]];
    default:
      return;
  }
}

function moveTo(direction) {
  // const directi = currentDirection;
  function move() {
    currentDirection = direction; // setting current direction
    // console.time("sn");
    clear();
    // handle that moment when the snake is touched a bottom edge of the field

    const nextCell = getNextCell(); // new position in array depending on where is actual snake now

    actualSnake.forEach((el) => {
      if (nextCell === el) {
        // console.error("end of game");

        clearInterval(mainInterval);
        overlay.style.display = "flex";
        snakeWrapper.classList.add("shake");
        // console.log(nextCell, currentDirection);
      }
    });
    if (eatedFood) {
      actualSnake.push(nextCell);
      eatedFood = false;
    } else {
      moveSnake(nextCell);
    }
    printSnake();
    // console.timeEnd("sn");
  }
  return move;
}

function moveSnake(nextCell) {
  if (nextCell.classList[1] === "food_cell") {
    // console.log(actualSnake.length);
    eatedFood = true;
    actualSnake.push(nextCell);
    actualSnake.shift();

    currentFoodPosition.classList.remove("food_cell");

    currentFoodPosition = getFoodposition();
  } else {
    actualSnake.push(nextCell);
    actualSnake.shift(); // removing last bite(element) of the snake
  }
}

function findPosition() {
  matrixDOM.forEach((line, lineInd) => {
    line.forEach((dot, dotInd) => {
      if (dot === actualSnake[actualSnake.length - 1]) {
        position = [lineInd, dotInd];
      }
    });
  });
  return position;
}
function createMatrix() {
  // console.time("create matrix");
  for (let i = 0; i < matrixSize; i++) {
    // matrix.push([]);
    matrixDOM.push([]);
    for (let j = 0; j < matrixSize; j++) {
      const newSnakeBite = document.createElement("div");
      newSnakeBite.className = "snake_block_wrapper";
      // if (i === 0 && j === 0) {
      //   // initial snake
      //   newSnakeBite.style.backgroundColor = "#af5";
      // }
      snakeWrapper.appendChild(newSnakeBite);
      // matrix[i].push([]);
      matrixDOM[i].push(newSnakeBite);
    }
  }
  // console.timeEnd("create matrix");
}

function chooseLevelHandler(e) {
  const startMenu = document.querySelector(".start_game");
  // e.stopPropagation();

  const level = e.target.classList[0];

  switch (level) {
    case "easy":
      snakeInterval = 135;
      break;
    case "medium":
      snakeInterval = 95;
      break;
    case "hard":
      snakeInterval = 60;
      break;
    default:
      break;
  }
  startMenu.style.display = "none";
  startGame();
}

function onKeyPress(e) {
  count += 1;
  test.innerHTML = count;
  e.stopPropagation();
  const key = e.key || e.target.classList[0];
  switch (key) {
    case "ArrowDown":
      if (currentDirection === "up") return; // return if we press move down while mooving up
      console.log("setting");
      currentMove = moveTo("down");
      break;
    case "button_down":
      if (currentDirection === "up") return; // return if we press move down while mooving up
      currentMove = moveTo("down");
      break;
    case "ArrowRight":
      if (currentDirection === "left") return; // return if we press move to right while mooving left
      currentMove = moveTo("right");
      break;
    case "button_right":
      if (currentDirection === "left") return; // return if we press move to right while mooving left
      currentMove = moveTo("right");
      break;
    case "ArrowLeft":
      if (currentDirection === "right") return; // return if we press move right while mooving left
      currentMove = moveTo("left");
      break;
    case "button_left":
      if (currentDirection === "right") return; // return if we press move right while mooving left
      currentMove = moveTo("left");
      break;
    case "ArrowUp":
      if (currentDirection === "down") return; // return if we press move up while mooving down
      currentMove = moveTo("up");
      break;
    case "button_up":
      if (currentDirection === "down") return; // return if we press move up while mooving down
      currentMove = moveTo("up");
      break;
    default:
      return;
  }
}
