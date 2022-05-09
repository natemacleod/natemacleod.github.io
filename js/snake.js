// TO-DO
// 1. Start Screen
// 2. Game Over Screen
// 3. Retry Button
// 4: High Score Tracking
// 5: Get rid of global GameState / main() function?

const area = document.getElementById("gamearea").getContext("2d");
const cs = 800; // size of canvas
const gs = cs / 25; // size of each grid square (we want 25x25)

class GridSquare {
    x;
    y;
    constructor(cx, cy) {
        this.x = cx;
        this.y = cy;
    }
}

class GameState {
    snake;
    dir;
    apple;
    active;
    score;
    constructor() {
        let startPos = new GridSquare(384, 424);
        this.snake = [startPos];
        this.dir = "UP";
        this.apple = randomApple();
        this.active = true;
        this.score = 0;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fillSnake() {
    area.fillStyle = "black";
    area.strokeStyle = "#aaa";
    for (let i = 0; i < st.snake.length; i++) {
        area.fillRect(st.snake[i].x, st.snake[i].y, gs, gs);
        area.strokeRect(st.snake[i].x, st.snake[i].y, gs, gs);
    }
}

function fillApple() {
    area.fillStyle = "red";
    area.fillRect(st.apple.x, st.apple.y, gs, gs);
}

function updateScore() {
    area.fillStyle = "#ddd";
    area.fillRect(0, 0, 400, 40);
    area.fillStyle = "black";
    area.font = "35px sans-serif";
    area.textBaseline = "top";
    area.fillText(`Score: ${st.score}`, 10, 5, 400);
}

function clearBoard() {
    area.fillStyle = "white";
    area.strokeStyle = "white";
    area.fillRect(0, 40, cs, cs);
}

function randomApple() {
    let x = Math.floor(Math.random() * 25) * gs;
    let y = Math.floor(Math.random() * 25) * gs + 40;
    return new GridSquare(x, y);
}

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

function invalidMove() {
    if (st.snake[0].x < 0 || st.snake[0].x > cs - gs || st.snake[0].y < 40 || st.snake[0].y > cs - gs + 40) return true;
    for (let i = 1; i < st.snake.length; i++) {
        if (st.snake[0].x === st.snake[i].x && st.snake[0].y === st.snake[i].y) return true;
    }
    return false;
}

function resolveKeyEvent(e) {
    // Stops arrow keys and spacebar from scrolling the page
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    // Keybinds
    if (e.code === "ArrowUp" || e.code === "KeyW") st.dir = "UP";
    else if (e.code === "ArrowDown" || e.code === "KeyS") st.dir = "DOWN";
    else if (e.code === "ArrowLeft" || e.code === "KeyA") st.dir = "LEFT";
    else if (e.code === "ArrowRight" || e.code === "KeyD") st.dir = "RIGHT";
    else if (e.code === "Escape") st.active = false;

    // Activate game on first key press
    if(!gameActive && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyS", "KeyA", "KeyD"].indexOf(e.code) > -1) {
        st.active = true;
    }
}

st = new GameState();
fillSnake();
updateScore();

document.addEventListener("keydown", resolveKeyEvent);

async function game() {
    while (st.active) {
        move();
        if (invalidMove()) {
            st.active = false;
            break;
        }

        st.snake.pop();

        clearBoard();
        fillSnake();
        fillApple();

        if (st.snake[0].x === st.apple.x && st.snake[0].y === st.apple.y) await grow();
        else await sleep(100);
    }
}

game();
