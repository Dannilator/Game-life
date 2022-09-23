'use strict';

(() => {

  let stopBut = document.getElementById("stop");
  let pause = 0;

  const canvas = document.getElementById("action");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  let screenW = innerWidth;
  let screenH = innerHeight;
  let spaceW = canvas.clientWidth;
  let spaceH = canvas.clientHeight;

  canvas.width = 1000;
  canvas.height = 500;

  canvas.style.top = `${Math.round(0.5 * (screenH - spaceH))}px`;
  canvas.style.left = `${Math.round(0.5 * (screenW - spaceW))}px`;

  let stepGrid = 10;
  ctx.translate(0.5, 0.5);


  class Square {
    constructor(w) {
      this.w = w;
      this.isLive = 0;
      this.count = 0;
    }
  }


  let squares = [];

  for (let i = 0; i < spaceH / stepGrid; i++) {
    squares[i] = [];

    for (let j = 0; j < spaceW / stepGrid; j++) {
      squares[i].push(new Square(stepGrid));
    }
  }


  function drawGrid() {
    ctx.beginPath();

    for (let i = 0; i <= spaceW; i += stepGrid) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, spaceH);
    }

    for (let j = 0; j <= spaceH;  j += stepGrid){
      ctx.moveTo(0, j);
      ctx.lineTo(spaceW, j);
    }

    ctx.stroke();
    ctx.closePath();
  }


  function updateCount(sqArr) {
    let count = 0;

    for (let i = 0; i < sqArr.length; i++) { // Проходимся по рядам

      for (let j = 0; j < sqArr[i].length; j++) { // Проходимся по каждой клетке в ряду
        count = 0;

        let px, py;

        for (let k = 0; k < 9; k++) { // Проверяем все окружающие клетки
          // Пока границы связаны, если зайти за правую, то окажешься за левой и т.д.
          px = -1 + (k % 3);
          py = -1 + Math.floor(k / 3);

          if (px == 0 && py == 0) continue;

          if (j + px < 0) px = sqArr[i].length - 1;
          else if (j + px > sqArr[i].length - 1) px = 1 - sqArr[i].length; 

          if (i + py < 0) py = sqArr.length - 1;
          else if (i + py > sqArr.length - 1) py = 1 - sqArr.length; 

          if (sqArr[i + py][j + px].isLive == 1) count++;
        }
        sqArr[i][j].count = count;
      }

    }
  }

  function updateStatus(sqArr) {
    for (let i = 0; i < sqArr.length; i++) { // Проходимся по рядам
      for (let j = 0; j < sqArr[i].length; j++) { // Проходимся по каждой клетке в ряду
        let sq = sqArr[i][j];
        if (sq.count == 3 && sq.isLive == 0) sq.isLive = 1;
        else if (sq.count >= 2 && sq.count <= 3 && sq.isLive == 1) continue;
        else if (sq.isLive == 1) sq.isLive = 0;
      }
    }
  }

  function drawSquares(sqArr) {
    for (let i = 0; i < sqArr.length; i++) { // Проходимся по рядам
      for (let j = 0; j < sqArr[i].length; j++) { // Проходимся по каждой клетке в ряду
        if (sqArr[i][j].isLive == 1) {
          draw1Square(j, i);
        }
      }
    }
  }

  function draw1Square(x, y) {
    ctx.moveTo(stepGrid * x, stepGrid * y);
    ctx.fillRect(stepGrid * x, stepGrid * y, stepGrid, stepGrid);
  }

  stopBut.onclick = () => {
    pause = !pause;
  }

  let iter = 0;

  function loop() {
    if (!pause) {
      ctx.clearRect(0, 0, spaceW, spaceH);
      drawGrid();

      if (iter == 5) {
        updateCount(squares);
        updateStatus(squares);
        iter = 0;
      }
      drawSquares(squares);
      
      iter++;
    }

    window.requestAnimationFrame(loop);
  }

  loop();


  let mouse = {x: 0, y: 0};

  function target({layerX, layerY}) {

    [mouse.x, mouse.y] = [layerX, layerY];

    let targetX = Math.floor(mouse.x / stepGrid);
    let targetY = Math.floor(mouse.y / stepGrid);

    squares[targetY][targetX].isLive = !squares[targetY][targetX].isLive;
    if (squares[targetY][targetX].isLive) draw1Square(targetX, targetY);
    else {
      ctx.fillStyle = "white";
      draw1Square(targetX, targetY);
      ctx.fillStyle = "black";
    }
  }

  canvas.addEventListener("mousedown", target);


})();