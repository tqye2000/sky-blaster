//====================================================================================
// File: script.js
// Description: A simple JavaScript game where the player controls a spaceship and shoots 
// enemies falling from the top of the screen. The player can move left and right and shoot 
// bullets to destroy enemies. The game ends when an enemy collides with the player.
// Author: GPT-4o
// Date: 2025-03-28
// When      | Who         | What
// ----------|-------------|---------------------------------------------------------------
// 2025-03-28| GPT-4o      | Initial creation of the game script.
//====================================================================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player, bullets, enemies, keys, shootCooldown, score, gameOver;

function initGame() {
  player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 20,
    speed: 7,
    color: "lime"
  };

  bullets = [];
  enemies = [];
  keys = { left: false, right: false, space: false };
  shootCooldown = 0;
  score = 0;
  gameOver = false;

  scoreDisplay.textContent = "Score: 0";
  gameOverDisplay.classList.add("hidden");

  requestAnimationFrame(gameLoop);
}

// Spawn enemy
function spawnEnemy() {
  const size = 30;
  const x = Math.random() * (canvas.width - size);
  enemies.push({
    x,
    y: -size,
    width: size,
    height: size,
    speed: 2 + Math.random() * 2,
    color: "red"
  });
}

// Key events
document.addEventListener("keydown", e => {
//   if (gameOver) {
//     restartGame();
//     return;
//   }

  if (e.code === "ArrowLeft") keys.left = true;
  if (e.code === "ArrowRight") keys.right = true;
  if (e.code === "Space") keys.space = true;
});

document.addEventListener("keyup", e => {
  if (e.code === "ArrowLeft") keys.left = false;
  if (e.code === "ArrowRight") keys.right = false;
  if (e.code === "Space") keys.space = false;
});

restartBtn.addEventListener("click", restartGame);

function restartGame() {
  initGame();
}

function endGame() {
  gameOver = true;
  finalScoreDisplay.textContent = `Final Score: ${score}`;
  gameOverDisplay.classList.remove("hidden");
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Shoot bullets
  if (keys.space && shootCooldown <= 0) {
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 10,
      color: "yellow"
    });
    shootCooldown = 15;
  }
  if (shootCooldown > 0) shootCooldown--;

  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
    }
  }

  // Spawn enemies
  if (Math.random() < 0.02) {
    spawnEnemy();
  }

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.y += enemy.speed;

    // Collision with player
    if (
      enemy.x < player.x + player.width &&
      enemy.x + enemy.width > player.x &&
      enemy.y < player.y + player.height &&
      enemy.y + enemy.height > player.y
    ) {
      endGame();
      return;
    }

    // Remove if off screen
    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
      continue;
    }

    // Collision with bullets
    for (let j = bullets.length - 1; j >= 0; j--) {
      const bullet = bullets[j];
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        break;
      }
    }
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw bullets
  bullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw enemies
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  requestAnimationFrame(gameLoop);
}

// Start the game
initGame();
