//seleccionar canvas
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

cvs.style.border = "1px solid #0ff";

//Borde mas ancho
ctx.lineWidth = 3;


//paddle o barra y constantes

const PADDLEW = 100;
const PADDLE_MARGIN_BOTTOM = 100;
const PADDLEH = 20;
let leftArrow = false;
let rightArrow = false;
const BALL_RADIUS = 8;
let LIFE = 3;
let LEVEL = 1;
const MAX_LEVEL = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
const GAME_OVER = false;

//Paddle Object

const paddle = {
    x: cvs.width / 2 - PADDLEW / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLEH,
    width: PADDLEW,
    height: PADDLEH,
    dx: 5
}

//BALL
const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

//Dibujar rectangulo o Paddle

function drawPaddle() {
    ctx.fillStyle = "#2e3548";
    //eje x,eje y,width y height
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}


//Control paddle 
//Try arrow function maybe 
// document.addEventListener("keydown", function(event) {
//     if (event.keyCode == 37) {
//         leftArrow = true;
//     } else if (event.keyCode == 39) {
//         rightArrow = true;
//     }
// })

// document.addEventListener("keyup", function(event) {
//     if (event.keyCode == 37) {
//         leftArrow = false;
//     } else if (event.keyCode == 39) {
//         rightArrow = false;
//     }
// })


//***********************************ES6 *************************************
document.addEventListener("keydown", (event) => {
    if (event.keyCode == 37) {
        leftArrow = true;
    } else if (event.keyCode == 39) {
        rightArrow = true;
    }
})

document.addEventListener("keyup", (event) => {
    if (event.keyCode == 37) {
        leftArrow = false;
    } else if (event.keyCode == 39) {
        rightArrow = false;
    }
})




//move paddle

function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}



//DRAW THE BALL 

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    ctx.strokeStyle = "#2e3548"
    ctx.stroke();
    ctx.closePath();
}

//MOVE BALL 

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width / 2);

        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI / 3;


        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

//BALLCOLLISION 

function ballCollision() {
    if (ball.x - ball.radius > cvs.width || ball.x * ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        resetBall();
    }
}

//RESET BALL

function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.x = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//BRICKS LADRLLOS JEJE
//Todos los objetos los pude haber puesto en otra clase porque que verguero
const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"

}

//Creating array for the bricks

var bricks = [];

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.marginTop + brick.offSetTop,
                status: true
            }
        }
    }
}

createBricks();

//DRAW BRICKS YAY

function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            //Revisar si se rompio el ladrillo
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

//COLLISION WITH BRICKS

function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            //Revisar si se rompio el ladrillo
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width &&
                    ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = false; //Broken
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }

}

//GAME STATS

function showGameStats(text, textX, textY, img, imgX, imgY) {
    ctx.fillStyle = "#FFF";
    ctx.font = "20px Germania One";
    ctx.fillText(text, textX, textY);

    //IMG

    ctx.drawImage(img, imgX, imgY, width = 25, height = 25)
}


//GAME OVER PAPA 

function gameOver() {
    if (LIFE <= 0) {
        GAME_OVER = true;
    }
}

//LEVEL UP A VER SI LO HAGO

function levelUp() {
    var isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;

        }
    }

    if (isLevelDone) {
        if (LEVEL >= MAX_LEVEL) {
            GAME_OVER = true;
            return;
        }

        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

//DRAW FUNCTION o dibujar
function draw() {
    drawPaddle();


    drawBall();

    drawBricks();
    //SCORE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    //LIFE
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
    //LEVEL
    showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);


}

function update() {
    movePaddle();
    ballPaddleCollision();
    moveBall();
    ballCollision();
    ballBrickCollision();
    levelUp();
    gameOver();

}


function loop() {
    ctx.drawImage(BG_IMAGE, 0, 0);
    draw();
    update();

    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }
}

loop();