const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bear = {
  x: canvas.width / 2 - 20,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 0.5,
  jumpPower: -10,
  speed: 5,
  isJumping: false,
};

const eagle = {
  x: canvas.width,
  y: Math.random() * (canvas.height - 50),
  width: 50,
  height: 50,
  speed: 4,
};

let obstacles = [];
let score = 0;

// Load Bear and Eagle images
const bearImg = new Image();
bearImg.src = 'bear.png'; // Replace with bear image
const eagleImg = new Image();
eagleImg.src = 'eagle.png'; // Replace with eagle image

function update() {
  // Apply gravity
  bear.dy += bear.gravity;
  bear.y += bear.dy;

  // Bear can't fall below the canvas
  if (bear.y + bear.height > canvas.height) {
    bear.y = canvas.height - bear.height;
    bear.dy = 0;
  }

  // Eagle movement
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= obstacle.speed;

    // Remove off-screen eagles
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }

    // Collision detection with the bear
    if (
      bear.x < obstacle.x + obstacle.width &&
      bear.x + bear.width > obstacle.x &&
      bear.y < obstacle.y + obstacle.height &&
      bear.y + bear.height > obstacle.y
    ) {
      alert('Game Over! Score: ' + score);
      document.location.reload();
    }
  });

  // Add new eagle
  if (obstacles.length < 1 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
    let newEagle = {
      x: canvas.width,
      y: Math.random() * (canvas.height - 50),
      width: 50,
      height: 50,
      speed: 4,
    };
    obstacles.push(newEagle);
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bear
  ctx.drawImage(bearImg, bear.x, bear.y, bear.width, bear.height);

  // Draw eagles
  obstacles.forEach(obstacle => {
    ctx.drawImage(eagleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // Display score
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 10, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Control bear with mouse or touch
canvas.addEventListener('click', () => {
  bear.dy = bear.jumpPower;
});

// Control bear with arrow keys for left/right movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && bear.x > 0) {
    bear.x -= bear.speed;
  }
  if (e.key === 'ArrowRight' && bear.x + bear.width < canvas.width) {
    bear.x += bear.speed;
  }
});

bearImg.onload = gameLoop;
