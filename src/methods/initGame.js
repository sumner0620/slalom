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
