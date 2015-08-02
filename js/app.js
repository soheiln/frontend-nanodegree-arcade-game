//Game Configuration
var gameConfig = {
    rowSpace: 83,
    colSpace: 101,
    rowOffset: 50,
    colOffset: 50,
    numEnemies: 6,
    numEnemyRows: 3,
    enemyStartX: -400,
    enemyEndX: 600,
    enemySpeedRange: 500,
    collisionThreshold: {
        x: 40,
        y: 10
    }
};


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = this.getRandomSpeed();
    this.x = gameConfig.enemyStartX;
    this.y = this.getRandomY();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > gameConfig.enemyEndX) {
        this.x = gameConfig.enemyStartX;
    }
    this.x = this.x + (dt * this.speed);

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Generates a random Y coordinate for Enemy
Enemy.prototype.getRandomY = function() {
    var row = Math.floor( Math.random() * gameConfig.numEnemyRows);
    return gameConfig.rowOffset + row * gameConfig.rowSpace;
};


// Generates a random Y coordinate for Enemy
Enemy.prototype.getRandomSpeed = function() {
    return 100 + Math.random() * gameConfig.enemySpeedRange;
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 2 * gameConfig.colSpace;
    this.y = gameConfig.rowOffset + 4 * gameConfig.rowSpace;
    this.step = {x: gameConfig.colSpace, y: gameConfig.rowSpace};
};

//Player object method to run for each frame
Player.prototype.update = function() {
    //collision detection
    for(var i = 0; i < allEnemies.length; i++){
        if(this.isCollision(allEnemies[i])){
            this.resetLocation();
        }
    }
};

//Player object method to render player sprite on canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Player object method to handle keyboard input
Player.prototype.handleInput = function(keyCode) {
    var newX = this.x;
    var newY = this.y;
    if(keyCode === 'left') {
        newX = this.x - this.step.x;
    };
    if(keyCode === 'right') {
        newX = this.x + this.step.x;
    };
    if(keyCode === 'up') {
        newY = this.y - this.step.y;
    };
    if(keyCode === 'down') {
        newY = this.y + this.step.y;
    };

    //reset player if in water
    if(this.inWater(newX,newY)){
        this.resetLocation();
        return;
    }

    //check if new player position is in bounds
    if(this.inBounds(newX,newY)){
        this.x = newX;
        this.y = newY;
    };
};

//private method for Player object to detect collision with enemies
Player.prototype.isCollision = function(enemy) {
    if(Math.abs(this.x - enemy.x) < gameConfig.collisionThreshold.x &&
        Math.abs(this.y - enemy.y) < gameConfig.collisionThreshold.y) {
        return true;
    }
};

//private method for Player object to reset location to bottom row
Player.prototype.resetLocation = function() {
    this.x = 2 * gameConfig.colSpace;
    this.y = gameConfig.rowOffset + 4 * gameConfig.rowSpace;
};

//private method for Player object to check whether player location is valid
Player.prototype.inBounds = function(x, y) {
    if( x < 0 || x > 4 * gameConfig.colSpace || y < 0 || y > gameConfig.colOffset + 4 * gameConfig.rowSpace) {
        return false;
    }
    return true;
};

//private method for Player object to check whether player is in river
Player.prototype.inWater = function(x, y) {
    if(y < gameConfig.rowOffset) {
        return true;
    }
    return false;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];
for(var i = 0; i < gameConfig.numEnemies; i++){
    allEnemies.push(new Enemy());
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
