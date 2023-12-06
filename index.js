let board;
let boardWidth = 414;
let boardHeight = window.innerHeight;
let context;

const WIDTH_MULTI = boardWidth / 360;

// bird
let birdWidth = 34 * WIDTH_MULTI;
let birdHeight = 24 * WIDTH_MULTI;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;

let gameOver = false;
let score = 0;

const bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// pipes
let pipeArray = [];
let pipeWidth = 64 * WIDTH_MULTI;
let pipeHeight = 512 * WIDTH_MULTI;
let pipeX = boardWidth;
let pipeY = 0;

let topHeightImage;
let bottomHeightImage;

// physics
let velocityX = -2;
let velocityY = 0; // bird jump speed;
let gravity = 0.25;

window.onload = function () {
  board = document.getElementById("game");
  board.width = boardWidth;
  board.height = boardHeight;

  // used to draw on the canvas
  context = board.getContext("2d");

  // draw background
  const background = new Image();
  background.src = "./assets/flappybirdbg.png";

  background.onload = function () {
    context.drawImage(background, 0, 0, boardWidth, boardHeight);

    birdImage = new Image();
    birdImage.src = "./assets/flappybird.png";
    birdImage.onload = function () {
      context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    };

    topHeightImage = new Image();
    topHeightImage.src = "./assets/toppipe.png";
    bottomHeightImage = new Image();
    bottomHeightImage.src = "./assets/bottompipe.png";
  };

  requestAnimationFrame(update);
  setInterval(placePipes, 1000);
  document.addEventListener("click", moveBird);

  function update() {
    requestAnimationFrame(update);

    if (gameOver) {
      context.fillStyle = "#FFF";
      context.font = "50px Arial";
      context.fillText("GAME OVER", 15, 200);
      return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight);
    context.drawImage(background, 0, 0, boardWidth, boardHeight);

    // bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if (bird.y >= boardHeight - bird.height) {
      gameOver = true;
    }

    // pipes
    pipeArray.forEach((pipe) => {
      pipe.x += velocityX;
      context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

      if (!pipe.passed && bird.x > pipe.x + pipe.width) {
        pipe.passed = true;
        // there are two pipes for each gap
        score += 0.5;
      }

      if (isCollision(bird, pipe)) {
        gameOver = true;
      }
    });

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
      pipeArray.shift();
    }

    // score
    context.fillStyle = "#FFF";
    context.font = "20px Arial";
    context.fillText(score, 15, 30);
  }

  function placePipes() {
    if (gameOver) {
      return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight / 4;

    const topPipe = {
      img: topHeightImage,
      x: pipeX,
      y: randomPipeY,
      width: pipeWidth,
      height: pipeHeight,
      passed: false,
    };

    const bottomPipe = {
      img: bottomHeightImage,
      x: pipeX,
      y: randomPipeY + pipeHeight + openingSpace,
      width: pipeWidth,
      height: pipeHeight,
      passed: false,
    };

    pipeArray.push(topPipe, bottomPipe);
  }

  function moveBird() {
    velocityY = -6 - gravity;
    if (gameOver) {
      gameOver = false;
      bird.y = birdY;
      pipeArray = [];
      score = 0;
    }
  }

  function isCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
};
