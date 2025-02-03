// GRABS CANVAS FROM HTML AND ALLOWS 2D GRAPHICS 
const canvas = document.getElementById("gameCanvas"); 
const ctx = canvas.getContext("2d"); 

// CANVAS DIMENTIONS
canvas.width = 360;
canvas.height = 640;

// KEY ARRAY 
const keys = [];

// PLAYER 
const player = {
    x: 130,
    y: 450,
    width: 48,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: 5,
    jumpSpeed: 15,
    moving: false,
    jumping: false,
    velocityY: 0,
    gravity: 0.7,
    attacking: false,
    death: false
};

// SPRITE TILE
const tileWidth = 48;
const tileheight = 48;

// RETRIEVE SPRITES
const playerImg = new Image();
playerImg.src = "character.png";
const playerImg2 = new Image();
playerImg2.src = "character2.png";
const backgroundImg = new Image();
backgroundImg.src = "background.png";
const logImg = new Image();
logImg.src = "log.png";
const sawbladeImg = new Image();
sawbladeImg.src = "sawblade.png";
const playButtonImg = new Image();
playButtonImg.src = "playbutton.png";
const logoImg = new Image();
logoImg.src = "logo.png";
const highcoreImg = new Image();
highcoreImg.src = "highscore.png";

const playButton = {
    x: canvas.width / 2 - 72, // Center the button horizontally
    y: canvas.height / 2 + 25, // Place the button below the center
    width: 150,
    height: 150,
};

let gameStarted = false;



canvas.addEventListener('click', function (e) {
    if (!gameStarted) {
        checkPlayButtonClick(e); // Check if play button was clicked
    }
});

// WOOD LOGS
class Log {
    constructor(x, y, width, height, frameX, frameY, speed, gravity, spawnDelay = 0) {
        this.logX = Math.random() * (canvas.width - width);
        this.logY = y;
        this.logWidth = width;
        this.logHeight = height;
        this.frameX = frameX;
        this.frameY = frameY;
        this.speed = speed;
        this.gravity = gravity;
        this.velocityY = 0;
        this.disappearY = 660;
        this.spawnDelay = spawnDelay;  // Time to wait before log starts moving
        this.spawned = false;         // Flag to track if log is spawned
        this.spawnStartTime = null;   // Tracks the time when spawning starts
    }

    drawLog() {
        ctx.drawImage(logImg, 0, 0, 48, 48, this.logX, this.logY, 50, 50);
    }

    moveLog() {
        if (this.spawned) {
            if (this.logY < this.disappearY) {
                this.logY += this.speed;
            }
        }
    }

    updateLog() {
        if (this.logY === 650) {
            this.resetLog();
        }
    }

    resetLog(logs) {
        do {
            this.logX = Math.random() * (canvas.width - 48);
            this.logY = 0;  // Start from the top of the canvas
        } while (checkOverlap(this.logX, this.logY, logs));  // Check if the new position overlaps with any existing logs
    
        this.spawned = false;
        this.spawnStartTime = null;
    }

    checkSpawn() {
        if (!this.spawned && this.spawnStartTime === null) {
            this.spawnStartTime = Date.now();
        }
        if (this.spawnStartTime && Date.now() - this.spawnStartTime >= this.spawnDelay) {
            this.spawned = true;
        }
    }

    checkCollision(player) {
        if (player.x + player.width > this.logX &&
            player.x < this.logX + this.logWidth &&
            player.y + player.height > this.logY &&
            player.y < this.logY + this.logHeight) {
            return true;
        }
        return false;
    }
};


let logs = [
    new Log(0, -100, 48, 48, 0, 0, 5, 0.7, 1000),
    new Log(0, -100, 48, 48, 0, 0 , 5, 0.8, 0),
    //new Log(0, -100, 48, 48, 0, 0, 5, 0.5, 500)
];

let score = 0;

function checkPlayerLogCollision() {
    for (let i = 0; i < logs.length; i++) {
        if (logs[i].checkCollision(player)) {
            logAudio.play();
            updateScore();
            logs[i].resetLog();
            
            console.log("Log reset!");
            
            return true;
        }
    }
    return false;
} 

function updateScore() {
    score += 1;
};





let sawblades = [
    new Sawblade(0, -100, 48, 48, 0, 0, 5, 0.7, 500),
    new Sawblade(0, -100, 48, 48, 0, 0 , 5, 0.8, 1000),
    new Sawblade(0, -100, 48, 48, 0, 0, 5, 0.5, 0)
]; */

class Sawblade {
    constructor(x, y, width, height, frameX, frameY, speedX, speedY, gravity, spawnDelay = 0) {
        this.sawX = Math.random() * (canvas.width - width);  // Random horizontal spawn position
        this.sawY = y;
        this.sawWidth = width;
        this.sawHeight = height;
        this.frameX = frameX;
        this.frameY = frameY;
        this.speedX = speedX;  // Horizontal speed (diagonal movement)
        this.speedY = speedY;  // Vertical speed (falling down)
        this.gravity = gravity;
        this.velocityY = 0;
        this.spawnDelay = spawnDelay;
        this.spawned = false;
        this.spawnStartTime = null;
        this.totalFrames = 4;
    }

    drawSawblade() {
        ctx.drawImage(sawbladeImg, this.frameX * 48, 0, 48, 48, this.sawX, this.sawY, this.sawWidth * 1.5, this.sawHeight * 1.5);
    }

    moveSawblade() {
        if (this.spawned) {
            this.sawX += this.speedX;  // Move horizontally
            this.sawY += this.speedY;  // Move vertically

            // Bounce off left and right walls
            if (this.sawX <= 0 || this.sawX + this.sawWidth * 1.5 >= canvas.width) {
                this.speedX = -this.speedX;  // Reverse horizontal direction
            }

            // Apply gravity to the vertical speed to simulate falling
            //this.speedY += this.gravity;

            // Stop sawblade if it hits the bottom of the canvas (or you can reset it to top)
            if (this.sawY >= canvas.height) {
                this.resetSawblade();
            }
        }
    }

    updateSawblade() {
        // Reset sawblade if it goes out of the bottom of the canvas
        if (this.sawY >= canvas.height) {
            this.resetSawblade();
        }
        if (this.frameX == 3) {
            this.frameX = 0;  // Reset to first frame after reaching the last frame
        } else {
            this.frameX++;  // Move to the next frame
        }
    }

    resetSawblade() {
        // Reset sawblade position after it goes out of screen
        this.sawX = Math.random() * (canvas.width - 48);  // Randomize horizontal spawn position
        this.sawY = -50;  // Start from the top of the canvas
        this.spawned = false;
        this.spawnStartTime = null;
    }

    checkSpawn() {
        if (!this.spawned && this.spawnStartTime === null) {
            this.spawnStartTime = Date.now();
        }
        if (this.spawnStartTime && Date.now() - this.spawnStartTime >= this.spawnDelay) {
            this.spawned = true;
        }
    }

    checkSawCollision(player) {
        if (player.x + player.width > this.sawX &&
            player.x < this.sawX + this.sawWidth * .5 &&
            player.y + player.height > this.sawY &&
            player.y < this.sawY + this.sawHeight * .5) {

            if (!player.death) {
                player.death = true;
                player.frameX = 8; // Immediately trigger death animation
                player.velocityY = 0; // Stop vertical movement
                player.y = 450;       // Ensure the player stays on the ground
                deathAudio.play();     // Play death sound
            }
            return true;
        }
        return false;  // No collision
    }
}

let sawblades = [
    new Sawblade(0, -100, 48, 48, 0, 0, 2, 6, 0.2, 500),
    new Sawblade(0, -100, 48, 48, 0, 0 , 3, 8, 0.4, 1000),
    new Sawblade(0, -100, 48, 48, 0, 0, -3, 7, 0.3, 0)
];


function checkPlayerSawCollision() {
    for (let i = 0; i < sawblades.length; i++) {
        if (sawblades[i].checkSawCollision(player)) {
            if (!player.death) {
                player.death = true;
                player.frameX = 8; // Immediately trigger death animation
                player.velocityY = 0; // Stop vertical movement
                player.y = 450; // Ensure the player stays on the ground
                deathAudio.play(); // Play death sound
                console.log("Player has died!");
                return true; // Immediately stop checking once collision is detected
            }
        }
    }
    return false; // No collision
};



// PLAYERIMG2 BOOLEAN
let playerImg2Active = false;

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
};

// RETRIEVE AUDIO
const themeSong = new Audio('lumbersmacksongv1.mp3');
themeSong.loop = true;
themeSong.volume = 0.6;
themeSong.muted = false;

const jumpAudio = new Audio('lumbersmackjumpsoundv1.mp3');
jumpAudio.loop = false;
jumpAudio.volume = 1;
jumpAudio.preload = 'auto';
jumpAudio.muted = false;

const logAudio = new Audio('lumbersmacksmacksoundv1.mp3');
logAudio.loop = false;
logAudio.volume = 1;
logAudio.preload = 'auto';
logAudio.muted = false;

const deathAudio = new Audio('lumbersmackdeathsoundv1.mp3');
deathAudio.loop = false;
deathAudio.volume = 1;
deathAudio.preload = 'auto';
deathAudio.muted = false;

// KEY EVENTS 
window.addEventListener('keydown', function(e) {
    if (player.death) return;
    if (![65, 68, 32, 13].includes(e.keyCode)) { // 65 = A, 68 = D, 32 = Space
        e.preventDefault(); // Block any other key from doing anything
        return; // Exit early
    }
    if (e.keyCode === 65) { // "A" key
        playerImg2Active = true; // Activate playerImg2 when A is pressed
    }
    if (e.keyCode === 68) { // "D" key
        playerImg2Active = false; // Deactivate playerImg2 when D is pressed
    }
    if (e.keyCode === 32) {  // Spacebar (keyCode 32) to jump
        
        if (keys[65]) {
            drawSprite(playerImg2, player.width * player.frameX, player.height * player.frameY, tileWidth, tileheight, player.x, player.y, 100, 100);
        } 
        if (keys[68]) {
            drawSprite(playerImg, player.width * player.frameX, player.frameY, tileWidth, tileheight, player.x, player.y, 100, 100);
        }
        
    }
    if (e.keyCode === 13) {
        player.attacking = true;
        player.frameX = 5;
        if (checkPlayerLogCollision()) {
            logAudio.play();
            Log.resetLog(); // Reset the log if collision is detected and attack is pressed
            console.log("Log reset!");
        }
    }
    keys[e.keyCode] = true;
    player.moving = true;
});


window.addEventListener('keyup', function(e) {
    if (keys[32]) {
        player.jumping = true;
    }
    if (e.keyCode === 13) {
        player.attacking = false;
    }
    delete keys[e.keyCode];
    player.moving = false;
});



// PLAYER MOVEMENT
function movePlayer() {
    if (player.death) return;
    if (keys[68] && player.x < 290) {
        player.x += player.speed;
    }
    if (keys[65] && player.x > -40) {
        player.x -= player.speed;
    }
    if (keys[32] && player.y === 450 && !player.jumping) {
        jumpAudio.play();
        player.jumping = true;
        player.velocityY = -player.jumpSpeed;
        player.frameX = 4;
        jumpAudio.play();
    
    }
    player.y += player.velocityY;
    if (player.y < 450) {
        player.velocityY += player.gravity;
    }
    if (player.y >= 450) {
        player.y = 450;
        player.velocityY = 0;
        player.jumping = false;
    }
 
};

function playerFrame() {
    if (player.death) {
        // Immediately display the last death frame and stop any other animation
        if (player.frameX < 11) {
            player.frameX++; // Increment through death frames
        } else {
            player.frameX = 11; // Ensure the player stays on the last death frame
        }
        return; // Skip the rest of the logic, as we are in the death state
    }
    
    if (player.attacking) {
        if (player.frameX < 7) {
            player.frameX++;  // Move from 5 -> 6 -> 7
        } else {
            player.attacking = false;  // Stop attacking after frame 7
            player.frameX = 0;  // Reset to idle (frame 0) or set it to something else
        }
    } else if (player.jumping) {
        player.frameX = 3; // Assuming frame 3 is the jump frame
    } else if (player.moving) {
        if (player.frameX < 5) {
            player.frameX++;
        } else {
            player.frameX = 0;
        }
    } else {
        // Idle animation (you can set this to a different frame if idle is different)
        player.frameX = 0;
    }
}

// Helper function to check for overlapping positions
function checkOverlap(x, y, objects) {
    for (let obj of objects) {
        // Check if the new position overlaps with any object in the array
        if (x < obj.x + obj.width &&
            x + 48 > obj.x &&
            y < obj.y + obj.height &&
            y + 48 > obj.y) {
            return true;  // There's an overlap
        }
    }
    return false;  // No overlap
}


// GAME LOOP
let fps, fpsInterval, startTime, now, then, elapsed;

function startGameLoop(fps) {
    themeSong.play();
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    gameLoop();
};

function drawScore() {
    ctx.fillStyle = "black";  // Set text color to white
    ctx.font = "50px Arial";  // Set font size and type
    ctx.fillText(score, 20, 60);  // Draw the score at coordinates
}

function drawControls() {
    ctx.fillStyle = "white";  // Set text color to white
    ctx.font = "12px Monospace";  // Set font size and type
    ctx.fillText("A=left  D=right  Spacebar=jump  Enter=smack", 25, 555);  // Draw the score at coordinates
}

function drawFooter() {
    ctx.fillStyle = "white";  // Set text color to white
    ctx.font = "8px Monospace";  // Set font size and type
    ctx.fillText("By Matty Riback", 145, 630);  // Draw the score at coordinates
}

function drawStartScreen() {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImg, canvas.width / 2 - 150, 80, 300, 300);
    ctx.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height);
    drawControls();
    drawFooter();
};

function checkPlayButtonClick(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if mouse click is within the play button bounds
    if (
        mouseX >= playButton.x && mouseX <= playButton.x + playButton.width &&
        mouseY >= playButton.y && mouseY <= playButton.y + playButton.height
    ) {
        if (player.death) {
            resetGame();  // Reset the game after death
            gameStarted = true; // Start the game immediately after reset
            startGameLoop(40);  // Start the game loop again
        } else {
            gameStarted = true;  // Start the game if it's not already
            startGameLoop(40);  // Start the game loop
        }
    }
}



function resetGame() {
    score = 0;
    player.death = false;
    player.x = 130;  // Reset player position
    player.y = 450;
    player.velocityY = 0;
    player.jumping = false;
    player.moving = false;
    gameStarted = false;
    
    // Reset logs and sawblades
    logs.forEach(log => log.resetLog(logs));  // Pass the logs array to check overlap correctly
    sawblades.forEach(sawblade => sawblade.resetSawblade(sawblades));  // Pass sawblades array
    updateHighscore();
    gameLoop();  // Continue the game loop
}





let gameOver = false;

// Get highscore from localStorage (if exists)
let highscore = localStorage.getItem('highscore') ? parseInt(localStorage.getItem('highscore')) : 0;

function updateHighscore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);  // Save new highscore to localStorage
    }
}

function drawGameOverScreen() {
    themeSong.muted = false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    // Draw "Game Over" text
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 130, canvas.height / 2 - 100);
    
    // Display current score
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2);
    
    // Display highscore
    ctx.fillText("Highscore: " + highscore, canvas.width / 2 - 90, canvas.height / 2 + 40);
    
    // Draw play button
    ctx.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height);
    
    // Check for button click on restart screen
    canvas.addEventListener('click', function (e) {
        if (gameStarted && player.death) {
            checkPlayButtonClick(e);  // Trigger the play button click action (restart game)
        }
    });
}


function gamePlaying() {
    themeSong.muted = true;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

            if (player.death) {
                updateHighscore();  // Update highscore when the game ends
                drawGameOverScreen();  // Show game over screen
                
                //return;  // Stop game loop after death screen
            }

            // Normal gameplay continues when the player is alive
            if (playerImg2Active) {
                drawSprite(playerImg2, player.width * player.frameX, player.height * player.frameY, tileWidth, tileheight, player.x, player.y, 100, 100);
            } else {
                drawSprite(playerImg, player.width * player.frameX, player.frameY, tileWidth, tileheight, player.x, player.y, 100, 100);
            }

            floorCollision();
            movePlayer();
            playerFrame();
            checkPlayerSawCollision();
            drawScore();

            logs.forEach(log => {
                log.checkSpawn();
                log.moveLog();
                log.updateLog();
                log.drawLog();
            });

            sawblades.forEach(sawblade => {
                sawblade.checkSpawn();
                sawblade.moveSawblade();
                sawblade.updateSawblade();
                sawblade.drawSawblade();
            });
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        if (!gameStarted) {
            drawStartScreen();
        } else {
            gamePlaying();
        }
    }
}



// FLOOR COLLISION
function floorCollision() {
    if (player.y > 450) {
        player.y = 450;
    }
    
};

startGameLoop(40);

function isMobile() {
    return window.innerWidth <= 768;  // Adjust the threshold as needed
}

function toggleMobileButtons() {
    const isMobileDevice = isMobile();

    // Show buttons on mobile, hide on desktop
    const buttons = document.querySelectorAll('.mobile-button');
    buttons.forEach(button => {
        if (isMobileDevice) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}
