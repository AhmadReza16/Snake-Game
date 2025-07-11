const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    running= true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }     
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode; // کد کلید فشرده‌شده را می‌گیرد
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40; // کد کلیدهای جهت‌نما

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize; // اگر کلید چپ و مار به راست نمی‌رفت، به چپ برود
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize; // اگر کلید بالا و مار به پایین نمی‌رفت، به بالا برود
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize; // اگر کلید راست و مار به چپ نمی‌رفت، به راست برود
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize; // اگر کلید پایین و مار به بالا نمی‌رفت، به پایین برود
            break;
    }
};
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false; // اگر سر مار از سمت چپ بیرون رفت، بازی متوقف شود
            break;
        case (snake[0].x >= gameWidth):
            running = false; // اگر سر مار از سمت راست بیرون رفت، بازی متوقف شود
            break;
        case (snake[0].y < 0):
            running = false; // اگر سر مار از بالا بیرون رفت، بازی متوقف شود
            break;
        case (snake[0].y >= gameHeight):
            running = false; // اگر سر مار از پایین بیرون رفت، بازی متوقف شود
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false; // اگر سر مار به بدن خودش خورد، بازی متوقف شود
        }
    }
};
function displayGameOver(){
    ctx.font = "50px MV Boli"; // فونت متن را تنظیم می‌کند
ctx.fillStyle = "black"; // رنگ متن را مشکی می‌کند
ctx.textAlign = "center"; // متن را وسط‌چین می‌کند
ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2); // پیام "Game Over" را وسط صفحه نمایش می‌دهد
running = false; // بازی را متوقف می‌کند
};
function resetGame(){
    score = 0; // امتیاز را صفر می‌کند
    xVelocity = unitSize; // جهت حرکت مار را به راست برمی‌گرداند
    yVelocity = 0;
    snake = [ // مار را به حالت اولیه (۵ تکه) برمی‌گرداند
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart(); // بازی را دوباره شروع می‌کند
};


// gameStart: بازی را شروع می‌کند، امتیاز را صفر می‌کند، غذا می‌سازد و حلقه بازی را اجرا می‌کند.
// nextTick: هر بار صفحه را پاک می‌کند، مار و غذا را می‌کشد، مار را حرکت می‌دهد، وضعیت باخت را چک می‌کند و دوباره خودش را صدا می‌زند (حلقه بازی).
// clearBoard: صفحه بازی را پاک می‌کند.
// createFood: غذا را در یک جای تصادفی روی صفحه قرار می‌دهد.
// drawFood: غذا را روی صفحه می‌کشد.
// moveSnake: مار را به جهت فعلی حرکت می‌دهد و اگر غذا خورد، بزرگ می‌شود.
// drawSnake: مار را روی صفحه می‌کشد.
// changeDirection: جهت حرکت مار را با کلیدهای جهت‌نما تغییر می‌دهد.
// checkGameOver: بررسی می‌کند که مار به دیوار یا خودش خورده یا نه (اگر خورده، بازی تمام می‌شود).
// displayGameOver: پیام "Game Over" را وسط صفحه نمایش می‌دهد.
// resetGame: بازی را ریست می‌کند و از اول شروع می‌کند.