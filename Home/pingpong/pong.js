// select canvas element
const canvas = document.getElementById("pingpong");

// getContext of canvas 
const ctx = canvas.getContext('2d');
// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "RED"
}

// User Paddle
const user = {
    x : (canvas.width - 100)/2, 
    y : 0 , 
    height : 10,
    score : 0,
    color : "ORANGE"
}

// COM Paddle
const com = {
    x : (canvas.width - 100)/2,
    y : canvas.height - 10, 
    height : 10,
    score : 0,
    color : "ORANGE"
}

// NET
const net = {
    x : 0,
    y : (canvas.height - 2)/2,
    height : 2,
    width : 10,
    color : "TURQUOISE"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.x = evt.clientX - rect.left - user.width/2;
}

// when COM or USER wins, we reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityY = -ball.velocityY;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.width; i+=15){
        drawRect(net.x +i , net.y , net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "ORANGE";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b,p){
    p.left = p.x;
    p.right = p.x + p.width;
    p.top = p.y;
    p.bottom = p.y + p.height;
    
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    
    return p.top < b.bottom && p.left < b.right && p.bottom > b.top && p.right > b.left;
}

// update function
function update(){
    
    // change the score of players, if the ball goes to the left "ball.y<0" computer win, else if "ball.y > canvas.height" the user win
    if( ball.y - ball.radius < 0 ){
        com.score++;
        if( com.score == 5){
            $(document).ready(function(){ 
                $("#userprog").val(parseInt($("#userprog").html())+10) 
             });
                alert("you lost \n game is over");
                com.score=-1;
            user.score=0;

        }else{
        comScore.play();
        resetBall();}
    }else if( ball.y + ball.radius > canvas.height){
        user.score++;
        if(user.score ==5){
            $(document).ready(function(){ 
                $("#comprog").html(parseInt($("#comprog").html())+10) 
             });
            alert("congratulation you get 10 points");
           
          
            com.score=-1;
            user.score=0;
        
          
        }else{
        userScore.play();
        resetBall();
        }
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
   
    com.x += ((ball.x - (com.x + com.width/2)))*0.1;
    
    // when the ball collides with bottom and top walls we inverse the x velocity.
    if(ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width){
        ball.velocityX = -ball.velocityX;
        wall.play();
    }
    
    // we check if the paddle hit the user or the com paddle
    let player = (ball.y + ball.radius < canvas.height/2) ? user : com;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // play sound
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.x - (player.x + player.width/2));
        // -player.width/2 < collide Point < player.width/2
        collidePoint = collidePoint / (player.width/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.y + ball.radius < canvas.height/2) ? 1 : -1;
        ball.velocityY = direction * ball.speed * Math.cos(angleRad);
        ball.velocityX = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function, the function that does al the drawing
function render(){
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "GREY");
    
    // draw the user score to the left
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // draw the COM score to the right
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    // draw the net
    drawNet();
    // draw the COM's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
   
}
function startgame(){
  
    update();
    render();
}


// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(startgame,1000/framePerSecond);

