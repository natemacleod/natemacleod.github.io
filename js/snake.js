/* Snake game for natemacleod.github.io/snake
   Created by Nate MacLeod
   v1.0.1 (2022/05/31)
*/

/* BASIC FUNCTIONS */

// Global constants
const area = document.getElementById("gamearea").getContext("2d");
const cs = 800; // size of canvas
const gs = cs / 25; // size of each grid square (we want 25x25)

// Object used for coordinates of snake parts and apple
class GridSquare {
    x;
    y;
    constructor(cx, cy) {
        this.x = cx;
        this.y = cy;
    }
}

// Object used to store all relevant variables
class GameState {
    snake;
    dir;
    apple;
    active;
    score;
    hs;
    constructor() {
        let startPos = new GridSquare(384, 424);
        this.snake = [startPos];
        this.dir = "NONE";
        this.apple = randomApple();
        this.active = true;
        this.score = 0;
        this.hs = 0;
    };

    // Resets everything except high score
    clear() {
        let startPos = new GridSquare(384, 424);
        this.snake = [startPos];
        this.dir = "NONE";
        this.apple = randomApple();
        this.active = true;
        this.score = 0;
    }
}

// Causes the program to wait a certain amount of time before continuing
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* GRAPHICS FUNCTIONS */

// Shows the position of the snake
function fillSnake() {
    area.fillStyle = "black";
    area.strokeStyle = "#aaa";
    for (let i = 0; i < st.snake.length; i++) {
        area.fillRect(st.snake[i].x, st.snake[i].y, gs, gs);
        area.strokeRect(st.snake[i].x, st.snake[i].y, gs, gs);
    }
}

// Shows the position of the apple
function fillApple() {
    area.fillStyle = "red";
    area.fillRect(st.apple.x, st.apple.y, gs, gs);
}

// Updates the score display (and the high score display if necessary)
function updateScore() {
    area.fillStyle = "#ddd";
    area.fillRect(0, 0, 800, 40);
    area.fillStyle = "black";
    area.font = "35px sans-serif";
    area.textBaseline = "top";
    area.fillText(`Score: ${st.score}`, 10, 5, 200);

    let hs = Math.max(st.hs, st.score);
    st.hs = hs;
    area.fillText(`High Score: ${hs}`, 210, 5, 400);
}

// Clears the main game board (not the score display, that is done in updateScore)
function clearBoard() {
    area.fillStyle = "white";
    area.strokeStyle = "white";
    area.fillRect(0, 40, cs, cs);
}

/* GAME LOGIC */

// Randomizes the position of the apple
function randomApple() {
    let x = Math.floor(Math.random() * 25) * gs;
    let y = Math.floor(Math.random() * 25) * gs + 40;
    return new GridSquare(x, y);
}

// Moves the snake, adding an additional block in the correct direction
// Note: the end block is popped in game, not here
//       this is to ensure compatibility with grow
function move() {
    let dx = 0;
    let dy = 0;

    switch (st.dir) {
        case "UP":
            dy = -gs;
            break;
        case "DOWN":
            dy = gs;
            break;
        case "LEFT":
            dx = -gs;
            break;
        case "RIGHT":
            dx = gs;
            break;
        default:
            console.log("ERROR: Invalid direction");
            return false;
    }

    let head = new GridSquare(st.snake[0].x + dx, st.snake[0].y + dy);
    st.snake.unshift(head);
    return true;
}

// Grows the snake by three blocks over the course of the next three moves (300 ms)
// Also increases score by one and updates it
async function grow() {
    st.score++;
    updateScore();
    st.apple = randomApple();
    for (let i = 0; i < 3; i++) {
        await sleep(100);
        move();
        if (invalidMove()) {
            st.active = false;
            break;
        }

        clearBoard();
        fillSnake();
        fillApple();

        if (st.snake[0].x === st.apple.x && st.snake[0].y === st.apple.y) await grow();
    }
}

// Checks if a move is invalid (outside of bounds or hits a snake block). 
// Returns true if the move is invalid, false if it is valid.
function invalidMove() {
    if (st.snake[0].x < 0 || st.snake[0].x > cs - gs || st.snake[0].y < 40 || st.snake[0].y > cs - gs + 40) return true;
    for (let i = 1; i < st.snake.length; i++) {
        if (st.snake[0].x === st.snake[i].x && st.snake[0].y === st.snake[i].y) return true;
    }
    return false;
}

// Starts the game on the first valid key press
async function start(e) {
    // Stops arrow keys and spacebar from scrolling the page
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyS", "KeyA", "KeyD"].indexOf(e.code) > -1) {
        st.clear();
        fillSnake();
        updateScore();

        // Keybinds
        if (e.code === "ArrowUp" || e.code === "KeyW") st.dir = "UP";
        else if (e.code === "ArrowDown" || e.code === "KeyS") st.dir = "DOWN";
        else if (e.code === "ArrowLeft" || e.code === "KeyA") st.dir = "LEFT";
        else if (e.code === "ArrowRight" || e.code === "KeyD") st.dir = "RIGHT";
        document.removeEventListener("keydown", start);

        document.addEventListener("keydown", changeDirection);
        await game();
        startScreen("restart");
    }
}

// Changes direction when keys are pressed. 
function changeDirection(e) {
    // Stops arrow keys and spacebar from scrolling the page
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    // Keybinds
    if (e.code === "ArrowUp" || e.code === "KeyW") st.dir = "UP";
    else if (e.code === "ArrowDown" || e.code === "KeyS") st.dir = "DOWN";
    else if (e.code === "ArrowLeft" || e.code === "KeyA") st.dir = "LEFT";
    else if (e.code === "ArrowRight" || e.code === "KeyD") st.dir = "RIGHT";
    else if (e.code === "Escape") st.active = false;

}

// Start/restart screen for the game
async function startScreen(str) {
    area.fillStyle = "#000";
    area.fillText(`Press an arrow key or W/A/S/D to ${str}.`, 100, 300, 600);
    area.strokeStyle = "#ddd";
    area.strokeText(`Press an arrow key or W/A/S/D to ${str}.`, 100, 300, 600);
    if (str === "restart") await sleep(250);
    document.addEventListener("keydown", start);
}

// Main game loop
async function game() {
    firstTurn = true;
    while (st.active) {
        if (!firstTurn) await sleep(100);

        move();

        if (firstTurn) firstTurn = false;

        if (invalidMove()) {
            st.active = false;
            break;
        }

        st.snake.pop();

        clearBoard();
        fillSnake();
        fillApple();

        if (st.snake[0].x === st.apple.x && st.snake[0].y === st.apple.y) await grow();
    }
}

// Start of program
let st = new GameState();
clearBoard();
fillSnake();
updateScore();
startScreen("start");