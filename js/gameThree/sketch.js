// Define the number of rows and columns
const numRows = 4;
const numCols = 6;

// Images holding PNGs
let images = [];
let arm;
let cat;
let cheems;
let duck;
let doge;
let jotchua;
let kermit;
let kirby;
let pepe;
let picachu;
let sponge;
let yoshi;
let table;
let table2;

function preload() {
  arm = loadImage("armsAsset.png");
  cat = loadImage("catAsset.png");
  cheems = loadImage("cheemsAsset.png");
  duck = loadImage("duckAsset.png");
  doge = loadImage("dogeAsset.png");
  jotchua = loadImage("jotchuaAsset.png");
  kermit = loadImage("kermitAsset.png");
  kirby = loadImage("kirbyAsset.png");
  pepe = loadImage("pepeAsset.png");
  picachu = loadImage("picachuAsset.png");
  sponge = loadImage("spongeAsset.png");
  yoshi = loadImage("yoshiAsset.png");
}

// This array holds all of the Square objects which make up the grid
let grid = [];

// This array keeps track of the Square objects you click on for the purpose of determining if you click two of the same color (i.e. they match)
let clickedSquares = [];

class Square {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.notMatched = true;
    this.revealed = false;
  }

  display() {
    if (this.notMatched) {
      if (this.revealed) {
        image(this.img, this.x, this.y, this.w, this.h);
      } else {
        fill(255);
        rect(this.x, this.y, this.w, this.h);
      }
    }
  }

  contains(x, y) {
    return (
      x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
    );
  }
}

let gameStartTime;
const gameTime = 2 * 60 * 1000;
let gameOver = false;
let allSquaresNotMatched = false;
let mouseInteracted = false;
let countdown = gameTime;

function setup() {
  createCanvas(600, 400);
  resetGame();

  const resetButton = createButton("Reset");
  resetButton.position(20, 20);
  resetButton.mousePressed(resetGame);
}

function resetGame() {
  const squareWidth = width / numCols;
  const squareHeight = height / numRows;

  // Shuffle the images array
  images = shuffle([
    arm,
    cat,
    cheems,
    duck,
    doge,
    jotchua,
    kermit,
    kirby,
    pepe,
    picachu,
    sponge,
    yoshi,
    arm,
    cat,
    cheems,
    duck,
    doge,
    jotchua,
    kermit,
    kirby,
    pepe,
    picachu,
    sponge,
    yoshi,
  ]);

  grid = [];
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      let img = images.pop();
      grid.push(
        new Square(
          i * squareWidth,
          j * squareHeight,
          squareWidth,
          squareHeight,
          img
        )
      );
    }
  }

  gameStartTime = millis();
  gameOver = false;
  allSquaresNotMatched = false;
  mouseInteracted = false;
  countdown = gameTime;
}

function draw() {
  background(0);

  if (!gameOver) {
    for (let square of grid) {
      square.display();
    }

    allSquaresNotMatched = grid.every((square) => !square.notMatched);

    if (millis() - gameStartTime > gameTime || allSquaresNotMatched) {
      if (allSquaresNotMatched) {
        fill(0, 255, 0);
        rect(0, 0, width, height);
        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("Continue", width / 2, height / 2);
      } else {
        fill(255, 0, 0);
        rect(0, 0, width, height);
        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2);
      }
    } else {
      countdown = gameTime - (millis() - gameStartTime);
      const seconds = Math.ceil(countdown / 1000);
      fill(0);
      textSize(24);
      textAlign(CENTER);
      text(`Time Remaining: ${seconds} seconds`, width / 2, 20);
    }
  } else {
    for (let square of grid) {
      if (square.contains(mouseX, mouseY)) {
        square.notMatched = true;
        gameOver = false;
        break;
      }
    }
  }
}

function mouseClicked() {
  if (!gameOver) {
    for (let square of grid) {
      if (square.contains(mouseX, mouseY) && square.notMatched) {
        clickedSquares.push(square);
        square.revealed = true;

        if (clickedSquares.length === 3) {
          if (clickedSquares[0].img === clickedSquares[1].img) {
            clickedSquares[0].notMatched = false;
            clickedSquares[1].notMatched = false;
            clickedSquares[2].revealed = false;
          } else {
            clickedSquares[0].revealed = false;
            clickedSquares[1].revealed = false;
            clickedSquares[2].revealed = false;
          }

          clickedSquares = []; // Clear the clicked squares array
        }
      }
    }
  }
}
