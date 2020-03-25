var jet;
var wall = [];

function initGame() {
  fieldCanvas.start();
  jet = new Component(10, 20, "white", 300, 560);
  wall.push(new Component(10, 10, "red", 400, 0));
  wall[0].speedY = 1;
  document.addEventListener("keydown", e => {
    if (e.keyCode == "37") {
      jet.moveLeft();
    } else if (e.keyCode == "39") {
      jet.moveRight();
    } else {
      jet.center();
    }
  });
}

class Component {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
  }
  update() {
    let ctx = fieldCanvas.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  moveLeft() {
    if (this.speedX > 0) {
      this.speedX = -1;
    } else if (this.speedX > -4) {
      this.speedX = -3;
    }
  }
  moveRight() {
    if (this.speedX < 0) {
      this.speedX = 1;
    } else if (this.speedX < 4) {
      this.speedX = 3;
    }
  }
  center() {
    this.speedX = 0;
  }
  checkCrash(obstacle) {
    let leftSide = this.x;
    let rightSide = this.x + this.width;
    let front = this.y;
    let back = this.y + this.height;
    let obstacleLeft = obstacle.x;
    let obstacleRight = obstacle.x + obstacle.width;
    let obstacleTop = obstacle.y;
    let obstacleBottom = obstacle.y + obstacle.height;
    let crash = true;
    if (
      back < obstacleTop ||
      front > obstacleBottom ||
      rightSide < obstacleLeft ||
      leftSide > obstacleRight
    ) {
      crash = false;
    }
    return crash;
  }
}

const updateGameArea = () => {
  fieldCanvas.clear();
  fieldCanvas.frameNo += fieldCanvas.phase;
  fieldCanvas.score += 1;
  wall.forEach(component => {
    if (jet.checkCrash(component)) {
      fieldCanvas.stop();
    }
  });
  jet.newPos();
  jet.update();
  if ((fieldCanvas.frameNo / 1000) % 1 === 0 && fieldCanvas.phase < 6) {
    fieldCanvas.phase += 1;
  }
  if (wall[wall.length - 1].y >= 5) {
    let gap = 25 * (10 - fieldCanvas.phase);
    let lastX = wall[wall.length - 1].x - gap;
    let newObj = generateWall(lastX);
    let newX = Math.random() * window.innerWidth;
    wall.push(new Component(10, 10, newObj.color, newX, 0));
  }
  wall.forEach(component => {
    component.speedY = fieldCanvas.phase;
    component.newPos();
    component.update();
  });
  updateScore();
};

const generateWall = lastX => {
  let random = Math.random();
  let adjustment = () => {
    if (random > 0.667) {
      return 5;
    } else if (random > 0.334) {
      return 0;
    } else {
      return -5;
    }
  };
  let obj = {};
  let colors = [
    "green",
    "blue",
    "red",
    "pink",
    "yellow",
    "orange",
    "purple",
    "beige",
    "teal",
    "maroon"
  ];
  obj.color = colors[Math.floor(Math.random() * colors.length)];
  obj.x = lastX + adjustment();
  return obj;
};

const updateScore = () => {
  let score = document.querySelector(".score");
  score.innerHTML = `Score: ${fieldCanvas.score}`;
};

var fieldCanvas = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.querySelector(".game").appendChild(this.canvas);
    this.interval = setInterval(updateGameArea, 20);
    this.frameNo = 0;
    this.score = 0;
    this.phase = 1;
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }
};

document.querySelector(".start").addEventListener("click", () => initGame());
