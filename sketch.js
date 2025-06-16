let player;
let obstacles = [];
let collectibles = [];
let scene = "campo"; // campo ou cidade
let score = 0;

function setup() {
  createCanvas(800, 400);
  player = new Player();
  generateObjects();
}

function draw() {
  background(scene === "campo" ? "green" : "gray");
  
  player.update();
  player.display();

  // Mostrar obstáculos
  for (let obs of obstacles) {
    obs.move();
    obs.display();
    if (obs.hits(player)) {
      textSize(32);
      fill("red");
      text("Game Over", width / 2 - 80, height / 2);
      noLoop();
    }
  }

  // Mostrar itens
  for (let i = collectibles.length - 1; i >= 0; i--) {
    let item = collectibles[i];
    item.display();
    if (item.collect(player)) {
      collectibles.splice(i, 1);
      score += 10;
    }
  }

  fill(255);
  textSize(16);
  text(`Pontuação: ${score}`, 10, 20);

  // Transição de fase
  if (score >= 50 && scene === "campo") {
    scene = "cidade";
    player.x = 50;
    obstacles = [];
    collectibles = [];
    generateObjects();
  }

  if (score >= 100) {
    textSize(28);
    fill("yellow");
    text("Você chegou à cidade com sucesso!", width / 2 - 200, height / 2);
    noLoop();
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) player.move(1, 0);
  if (keyCode === LEFT_ARROW) player.move(-1, 0);
  if (keyCode === UP_ARROW) player.move(0, -1);
  if (keyCode === DOWN_ARROW) player.move(0, 1);
}

function generateObjects() {
  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle());
    collectibles.push(new Collectible());
  }
}

class Player {
  constructor() {
    this.x = 50;
    this.y = height - 50;
    this.size = 30;
  }

  move(dx, dy) {
    this.x += dx * 10;
    this.y += dy * 10;
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  update() {}

  display() {
    fill("blue");
    rect(this.x, this.y, this.size, this.size);
  }
}

class Obstacle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = 30;
    this.speed = random(1, 3);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) this.y = 0;
  }

  display() {
    fill(scene === "campo" ? "brown" : "red");
    ellipse(this.x, this.y, this.size);
  }

  hits(player) {
    return dist(this.x, this.y, player.x, player.y) < this.size / 2 + player.size / 2;
  }
}

class Collectible {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = 20;
  }

  display() {
    fill(scene === "campo" ? "orange" : "lightblue");
    ellipse(this.x, this.y, this.size);
  }

  collect(player) {
    return dist(this.x, this.y, player.x, player.y) < this.size / 2 + player.size / 2;
  }
}
