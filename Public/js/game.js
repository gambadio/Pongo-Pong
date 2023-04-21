const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const STATE_ENTER_NAME = 4;
const STATE_MENU = 0;
const STATE_GAME = 1;
const STATE_HIGHSCORES = 2;
const STATE_ENDGAME = 3;

let gameState = STATE_MENU;

let playerPaddle, computerPaddle, ball;
let playerScore = 0;
let computerScore = 0;
let playerName ="";

function initGame() {
  playerPaddle = new Paddle(10, canvas.height / 2 - 50, 10, 100);
  computerPaddle = new Paddle(canvas.width - 20, canvas.height / 2 - 50, 10, 100);
  ball = new Ball(canvas.width / 2, canvas.height / 2, 5);
}

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = 5;
  this.draw = function () {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function Ball(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.width = radius * 2;
  this.height = radius * 2;
  this.speedX = 5;
  this.speedY = 5;
  this.draw = function () {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };
}

function updatePaddles() {

  if (ball.y < computerPaddle.y + computerPaddle.height / 2) {
    computerPaddle.speed = -5;
  } else {
    computerPaddle.speed = 5;
  }
  computerPaddle.y = Math.min(Math.max(computerPaddle.y + computerPaddle.speed, 0), canvas.height - computerPaddle.height);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  initGame();
}

function drawDashedLine() {
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawEnterNameScreen() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Enter your name:", 270, canvas.height / 2 - 50);
  ctx.fillText(playerName + "_", 350, canvas.height / 2);
  ctx.fillText("Press ENTER to submit", 220, canvas.height / 2 + 50);
}

function updateBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Check for collision with top and bottom borders
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.speedY = -ball.speedY;
  }

  // Check for collision with paddles
  if (ball.x <= playerPaddle.x + playerPaddle.width && ball.y + ball.height >= playerPaddle.y && ball.y <= playerPaddle.y + playerPaddle.height) {
    ball.speedX = -ball.speedX;
    // Change the ball's speed depending on the paddle's speed
    ball.speedY += playerPaddle.speed;
  } else if (ball.x + ball.width >= computerPaddle.x && ball.y + ball.height >= computerPaddle.y && ball.y <= computerPaddle.y + computerPaddle.height) {
    ball.speedX = -ball.speedX;
    // Change the ball's speed depending on the paddle's speed
    ball.speedY += computerPaddle.speed;
  }

  // Check for scoring
  if (ball.x < 0) {
    computerScore++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = Math.random() < 0.5 ? -5 : 5;
    ball.speedY = (Math.random() * 4) - 2;
  } else if (ball.x + ball.width > canvas.width) {
    playerScore++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = Math.random() < 0.5 ? -5 : 5;
    ball.speedY = (Math.random() * 4) - 2;
  }
}


let lastTime;
function gameLoop(timestamp) {
  if (!lastTime) {
    lastTime = timestamp;
  }
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (deltaTime > 100) {
    // Skip this frame if deltaTime is too large
    requestAnimationFrame(gameLoop);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (gameState) {
    case STATE_MENU:
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Press SPACE to start the game", 170, canvas.height / 2);
      ctx.fillText("Press H to view High Scores", 230, canvas.height / 2 + 50);
      break;
    case STATE_GAME:
      drawDashedLine();
      playerPaddle.draw();
      computerPaddle.draw();
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
      updatePaddles();
      updateBall();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(playerScore, canvas.width / 4, 50);
      ctx.fillText(computerScore, (3 * canvas.width) / 4, 50);

      if (computerScore >= 5) {
        gameState = STATE_ENDGAME;
      }
      break;
      case STATE_HIGHSCORES:
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("High Scores", 340, canvas.height / 2 - 50);
        ctx.fillText("Press ESC to return to the main menu", 190, canvas.height / 2 + 50);
        break;
    case STATE_ENDGAME:
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Game Over", 340, canvas.height / 2 - 50);
      ctx.fillText("Press Y to submit your score", 220, canvas.height / 2);
      ctx.fillText("Press N to return to the main menu", 190, canvas.height / 2 + 50);
      break;
      case STATE_ENTER_NAME:
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Enter Your Name:", 280, canvas.height / 2 - 50);
        ctx.fillText(playerName, canvas.width / 2 - (playerName.length * 8), canvas.height / 2);
        ctx.fillText("Press ENTER to submit", 250, canvas.height / 2 + 50);
        break;
          
    default:
      break;
  }

  requestAnimationFrame(gameLoop);
}
  
canvas.addEventListener("mousemove", (e) => {
  if (gameState === STATE_GAME) {
      let canvasRect = canvas.getBoundingClientRect();
      let mouseY = e.clientY - canvasRect.top;
      playerPaddle.y = mouseY - playerPaddle.height / 2;
  }
});
  
document.addEventListener("keydown", (e) => {
  if (gameState === STATE_MENU) {
    if (e.code === "Space") {
      gameState = STATE_GAME;
    }
    if (e.code === "KeyH") {
      gameState = STATE_HIGHSCORES;
    }
  } else if (gameState === STATE_HIGHSCORES && e.code === "Escape") {
    gameState = STATE_MENU;
  } else if (gameState === STATE_ENDGAME) {
    if (e.code === "KeyY") {
      // Switch to the enter name state
      gameState = STATE_ENTER_NAME;
    } else if (e.code === "KeyN") {
      // Return to the main menu
      resetGame();
      gameState = STATE_MENU;
    }
  } else if (gameState === STATE_ENTER_NAME) {
    if (e.code === "Enter") {
      // Submit score and return to the main menu
      // Add score submission logic here
      resetGame();
      gameState = STATE_MENU;
    } else if (/^Key[A-Za-z]$/.test(e.code)) {
      // Allow the user to enter their name using the A-Z keys
      playerName += e.code.slice(3).toUpperCase();
      if (playerName.length > 10) {
        playerName = playerName.slice(0, 10);
      }
    } else if (e.code === "Backspace") {
      playerName = playerName.slice(0, -1);
    }
  }
});

  
  
  initGame(); // Add this line to initialize the game objects
  gameLoop(0);
  