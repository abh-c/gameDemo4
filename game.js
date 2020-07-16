let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");

const BALL_COLOR = "#e0e0e0";
const BALL_SIZE = 10;
const PADDLE_COLOR = "e0e0e0";
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 120;
const PLAYER_PADDLE_DY = 6;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 4;
let ballDY = 4;
let ballTop;
let ballBottom;
let opponentPaddleDY = 3;
let upIsPressed = false;
let downIsPressed = false;
let mouseY;

// paddles initialized opposite each other
let opponentPaddle = {name: "opponent", x: 765, y: (canvas.height - PADDLE_HEIGHT)/2};
let playerPaddle = {name: "player", x: 20, y: (canvas.height - PADDLE_HEIGHT)/2};

document.addEventListener("keydown", e => {
    if (e.keyCode === 38) {
        upIsPressed = true;
    }
    else if (e.keyCode === 40) {
        downIsPressed = true;
    }
});

document.addEventListener("keyup", e => {
    if (e.keyCode === 38) {
        upIsPressed = false;
    }
    else if (e.keyCode === 40) {
        downIsPressed = false;
    }
});

document.addEventListener("mousemove", e => {
    mouseY = e.clientY - canvas.offsetTop;
    if (mouseY > 0 && mouseY < canvas.height) {
        playerPaddle.y = mouseY - PADDLE_HEIGHT / 2;
        if (playerPaddle.y < 0) {
            playerPaddle.y = 0;
        }
        else if (playerPaddle.y > canvas.height - PADDLE_HEIGHT) {
            playerPaddle.y = canvas.height - PADDLE_HEIGHT;
        }
    }
});


/**
 * Draws the ball
 */
function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, BALL_SIZE, 0, Math.PI * 2);
    context.fillStyle = BALL_COLOR;
    context.fill();
    context.closePath();
}

/**
 * Draws a paddle
 * 
 * @param {Paddle} paddle 
 */
function drawPaddle(paddle) {
    context.beginPath();
    context.rect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    context.fillStyle = PADDLE_COLOR;
    context.fill();
    context.closePath();
}

/**
 * Move the opponent paddle side to side across the screen
 * Change directions to bounce off walls
 * Change directions if the paddle is moving away from the ball (optional)
 */
function moveOpponentPaddle() {
    if (opponentPaddle.y < 0 || 
        opponentPaddle.y + PADDLE_HEIGHT > canvas.height) {
        opponentPaddleDY = -opponentPaddleDY;
    }
    // optional to get the paddle to chase the ball
    else if ((ballY < opponentPaddle.y && opponentPaddleDY > 0) ||
            (ballY > opponentPaddle.y + PADDLE_HEIGHT && opponentPaddleDY < 0)) {
        opponentPaddleDY = -opponentPaddleDY;
    }

    opponentPaddle.y += opponentPaddleDY;
}

/**
 * Handles collision between the ball and the walls 
 */
function handleCollision() {
    ballTop = ballY - BALL_SIZE;
    ballBottom = ballY + BALL_SIZE;

    // Handle collision with the walls
    if (ballTop + ballDY < 0 || ballBottom > canvas.height) {
        ballDY = -ballDY;
    }
}

/**
 * Draws the game
 */
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    moveOpponentPaddle();
    drawPaddle(playerPaddle);
    drawPaddle(opponentPaddle);
    handleCollision();
    requestAnimationFrame(draw);
    ballX += ballDX;
    ballY += ballDY;
    if (upIsPressed) {
        playerPaddle.y -= PLAYER_PADDLE_DY;
        if (playerPaddle.y < 0) {
            playerPaddle.y += PLAYER_PADDLE_DY;
        }
    }
    else if (downIsPressed) {
        playerPaddle.y += PLAYER_PADDLE_DY;
        if (playerPaddle.y > canvas.height - PADDLE_HEIGHT) {
            playerPaddle.y -= PLAYER_PADDLE_DY;
        }
    }
}

draw();