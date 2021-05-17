var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
function(callback) { 
    window.setTimeout(callback, 1000/60) 
};

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext('2d');
//Ball colors
var hex;
var color = randColor;

var player = new Player();
var computer = new Computer();
var ball = new Ball(240, 320);
//Store the score
var playerScore = 0;
var aiScore = 0;

//Update function
var update = function(){
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
    
}

//Render function
var render = function(){
    context.fillStyle = "#eee";
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.render();
    computer.render();
    ball.render();
    drawScore();
}
//"step" function: update objects, render objects and recall "step" function
var step = function(){
    update();
    render();
    animate(step);
}
var keysDown = {};
window.onload = function(){
    document.canvas;
    animate(step);
}


// Paddles and Ball
function Paddle(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}
function Ball(x, y){
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 5;
}


//Changing color of a ball when it hits the wall
function convertToColor(num){
    return '#' + ('00000' + (num | 0).toString(16)).substr(-6);
}
function randColor(){
    hex = Math.floor(Math.random() * 100000 + 1);
    return convertToColor(hex);
}

//Create functions for Player and AI's paddles
function Player(){
    this.paddle = new Paddle(200, 630, 75, 10);
}
function Computer(){
    this.paddle = new Paddle(200, 0, 75, 10);
}
//Control the paddle
window.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
    });
window.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
});
//Render paddles
Paddle.prototype.render = function(){
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
}

//If paddles hit the wall
Paddle.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x<0){
        this.x = 0;
        this.x_speed = 0;
    } 
    else if(this.x + this.width > 480){
        this.x = 480 - this.width;
        this.x_speed = 0
    }
}
//Player
Player.prototype.render = function(){
    this.paddle.render();
} 
//Update Player
Player.prototype.update = function(){
    for(var key in keysDown){
        var value = Number(key);
        if(value == 37){
            //Left
            this.paddle.move(-10,0);
        } else if(value == 39){
            //Right
            this.paddle.move(10,0);
        } else{
            this.paddle.move(0,0);
        }
    }
}

//AI
Computer.prototype.render = function(){
    this.paddle.render();
}
Computer.prototype.update = function(ball){
    var AI_x = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width/2)) - AI_x);
    if(diff < 0 && diff < 4){
        //To the left
        diff = -5;
    } else if(diff > 0 && diff > 4){
        //To the right
        diff = 5;
    }
    this.paddle.move(diff, 0);
    if(this.paddle.x < 0){
        this.paddle.x = 0;
    } else if(this.paddle.x + this.paddle.width > 480){
        this.paddle.x = 480 - this.paddle.width;
    }
}

//Render Ball
Ball.prototype.render = function(){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}
//Update ball
Ball.prototype.update = function(paddle1, paddle2){
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;
    //Hitting left wall
    if(top_x < 0){
        this.x = 5;
        this.x_speed = -this.x_speed;
        color = randColor();
    } else if(this.x + 5 > 480){
    //Hitting right wall
        this.x = 475;
        this.x_speed = -this.x_speed;
        color = randColor();
    }
    //Scored (hit the top and bottom)
    if(this.y< 0){
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 240;
        this.y = 320;
        playerScore++;
    }
    else if(this.y> 640){
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 240;
        this.y = 320;
        aiScore++;
    }
    //Hitting paddles
    if(top_y > 300){
        if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x){
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x){
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;        
        }
    }
}

//Score
function drawScore(){
    context.font = "24px Helvetica";
    context.fillStyle = "#000000";
    context.fillText("Player: " + playerScore, 8, 20);
    context.fillText("COM: " + aiScore, 390, 20);
}




