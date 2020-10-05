const snakeWrapper = document.querySelector(".snake_parent_wrapper");
const matrixSize = 19;
let position; // actual position of the last snake bite(element)
let eatedFood = false; // snake eated food, we want to use it at next move, to add length to actualSnake;
let currentDirection;
let mainInterval;
let currentMove = moveDown; // initial function to move snake
let snakeInterval = 130; // interval to move snake
let actualSnake = [];
let matrixDOM = [];
createMatrix(); // creating DOM matrix
actualSnake = [matrixDOM[1][5], matrixDOM[2][5], matrixDOM[3][5]]; // setting up the initial snake
document.addEventListener("keydown", onKeyPress); // event listener for key press
let food;
let currentFoodPosition = getFoodposition();
// console.log(currentFoodPosition);
startGame(); // start game

snakeWrapper.style.width = matrixSize * 28 + 8 + "px";
function startGame() {
  printSnake(); // printing initial snake
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

function moveDown() {
  currentDirection = "down"; // setting current direction
  clear();
  // handle that moment when the snake is touched a bottom edge of the field
  let newPosition; // new position in array depending on where is actual snake now
  if (position[0] === matrixDOM.length - 2) {
    newPosition = matrixDOM.length - 1;
  } else if (position[0] === matrixDOM.length - 1) {
    newPosition = 0;
  } else {
    newPosition = position[0] + 1;
  }

  let nextCell = matrixDOM[newPosition][position[1]];
  actualSnake.forEach((el) => {
    if (nextCell === el) {
      console.error("end of game");
      clearInterval(mainInterval);
    }
  });
  if (eatedFood) {
    actualSnake.push(nextCell);
    eatedFood = false;
  } else {
    moveSnake(nextCell);
  }
  printSnake();
}

function moveSnake(nextCell) {
  if (nextCell.classList[1] === "food_cell") {
    // console.log(nextCell);
    console.log(actualSnake.length);
    eatedFood = true;
    actualSnake.push(nextCell);
    actualSnake.shift();
    // actualSnake.push(nextCell); // pushing next element of the snake actual position

    // console.log(currentFoodPosition.classList);
    // currentFoodPosition.className += "snake_block_wapper ";
    currentFoodPosition.classList.remove("food_cell");

    currentFoodPosition = getFoodposition();

    // function checkFoodPosition() {
    //   actualSnake.forEach((el) => {
    //     if (el === currentFoodPosition) {
    //       console.log("true");
    //       currentFoodPosition = getFoodposition();
    //       checkFoodPosition();
    //     }
    //   });
    // }

    // actualSnake.shift();
  } else {
    actualSnake.push(nextCell);
    actualSnake.shift(); // removing last bite(element) of the snake
  }
}

function moveRight() {
  currentDirection = "right"; // setting current direction
  clear();

  let newPosition; // new position in array depending on where is actual snake now
  if (position[1] === matrixDOM[position[0]].length - 2) {
    newPosition = matrixDOM[position[0]].length - 1;
  } else if (position[1] === matrixDOM[position[0]].length - 1) {
    newPosition = 0;
  } else {
    newPosition = position[1] + 1;
  }

  let nextCell = matrixDOM[position[0]][newPosition];
  actualSnake.forEach((el) => {
    if (nextCell === el) {
      console.error("end of game");
      clearInterval(mainInterval);
    }
  });
  if (eatedFood) {
    actualSnake.push(nextCell);
    eatedFood = false;
  } else {
    moveSnake(nextCell);
  }

  printSnake();
}

function moveLeft() {
  currentDirection = "left"; // setting current direction
  clear();

  let newPosition; // new position in array depending on where is actual snake now
  if (position[1] === 0) {
    newPosition = matrixDOM[position[0]].length - 1;
  } else {
    newPosition = position[1] - 1;
  }
  let nextCell = matrixDOM[position[0]][newPosition];
  actualSnake.forEach((el) => {
    if (nextCell === el) {
      console.error("end of game");
      clearInterval(mainInterval);
    }
  });
  if (eatedFood) {
    actualSnake.push(nextCell);
    eatedFood = false;
  } else {
    moveSnake(nextCell);
  }
  printSnake();
}

function moveUp() {
  currentDirection = "up"; // setting current direction
  clear();

  let newPosition; // new position in array depending on where is actual snake now
  if (position[0] === 0) {
    newPosition = matrixDOM.length - 1;
  } else {
    newPosition = position[0] - 1;
  }

  let nextCell = matrixDOM[newPosition][position[1]];
  actualSnake.forEach((el) => {
    if (nextCell === el) {
      console.error("end of game");
      clearInterval(mainInterval);
    }
  });
  if (eatedFood) {
    actualSnake.push(nextCell);
    eatedFood = false;
  } else {
    moveSnake(nextCell);
  }

  // if (position[0] === 0) {
  //   // handle that moment when the snake is touched an up edge of the field
  //   actualSnake.push(matrixDOM[matrixDOM[0].length - 1][position[1]]);
  //   actualSnake.shift(); // removing last bite(element) of the snake
  // } else {
  //   let nextCell = matrixDOM[position[0] - 1][position[1]];
  //   // let nextCellToAdd = matrixDOM[position[0] - 2][position[1]];
  //   if (nextCell.classList[1] === "food_cell") {
  //     actualSnake.push(nextCell); // pushing next element of the snake actual position
  //     actualSnake.push(matrixDOM[position[0] - 2][position[1]]); // pushing next element of the snake actual position
  //     currentFoodPosition.className += "snake_block_wapper";
  //     currentFoodPosition = getFoodposition();
  //     actualsnake = actualSnake.shift();
  //   } else {
  //     actualSnake.push(nextCell); // pushing next element of the snake actual position
  //     actualsnake = actualSnake.shift(); // here we're removing last bite(element) of the snake
  //   }
  // }
  printSnake();
}

function findPosition() {
  matrixDOM.forEach((line, lineInd) => {
    line.forEach((dot, dotInd) => {
      if (dot === actualSnake[actualSnake.length - 1]) {
        // if (dot === actualSnake[0]) {
        // position.push(lineInd, dotInd);
        position = [lineInd, dotInd];
        // console.log(position);
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

function onKeyPress(e) {
  // handle key press
  const key = e.key;
  switch (key) {
    case "ArrowDown":
      if (currentDirection === "up") return; // return if we press move down while mooving up
      currentMove = moveDown;
      break;
    case "ArrowRight":
      if (currentDirection === "left") return; // return if we press move to right while mooving left
      // console.log("right", currentDirection);
      currentMove = moveRight;
      break;
    case "ArrowLeft":
      if (currentDirection === "right") return; // return if we press move right while mooving left
      currentMove = moveLeft;
      break;
    case "ArrowUp":
      if (currentDirection === "down") return; // return if we press move up while mooving down
      currentMove = moveUp;
      break;
    default:
      return;
  }
}
