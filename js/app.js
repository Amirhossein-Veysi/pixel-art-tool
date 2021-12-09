let grid = null;
let cols = 0;
let rows = 0;
let boxSize = 31;
let selectedColor = 000;
let pressed = false;
let temporaryColor = null;
let boardColor = 255;
let tool = "brush";

function setup() {
  let canvas = createCanvas();
  const artBoardWidthInp = select("#board-width");
  const artBoardHeightInp = select("#board-height");
  const brushColorInp = select("#brush-color");
  const boardColorInp = select("#board-color");
  const popUpBtn = select(".popup button");
  const downloadBtn = select("#download-btn");
  const controls = selectAll(".control[data-tool]");
  
  brushColorInp.changed(() => {
    selectedColor = brushColorInp.value();
  });
  
  boardColorInp.changed(() => {
    boardColor = boardColorInp.value();
  });

  downloadBtn.mouseClicked(() => {
    saveCanvas(canvas, 'pixel-art', 'jpg');
  });
  
  controls.forEach((el) => {
    el.mouseClicked((event) => {
      console.log("clicked");
      controls.forEach((el) => el.removeClass("selected"));
      event.target.classList.add("selected");
      tool = event.target.dataset.tool;
    });
  });

  popUpBtn.mouseClicked(() => {
    resizeCanvas(artBoardWidthInp.value(), artBoardHeightInp.value());

    select(".popup-container").style("display", "none");
    cols = Math.floor(width / boxSize);
    rows = Math.floor(height / boxSize);
    console.log(cols, rows);
    grid = new Array(cols);

    for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }

    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < rows; x++) {
        grid[y][x] = new Pixel(y, x);
      }
    }
  });
}

function Pixel(x, y) {
  this.color = boardColor;
  this.colored = false;

  this.show = function () {
    fill(color(this.color));
    stroke(0);
    rect(x * boxSize, y * boxSize, boxSize, boxSize);
  };
}

function draw() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      if (
        mouseY > x * boxSize &&
        mouseY < x * boxSize + boxSize &&
        mouseX > y * boxSize &&
        mouseX < y * boxSize + boxSize
      ) {
        if (pressed) {
          grid[y][x].colored = tool == "brush";
          grid[y][x].color = tool == "brush" ? selectedColor : boardColor;
        }
        if (grid[y][x].colored) {
          temporaryColor = { x, y, color: grid[y][x].color };
        }
        grid[y][x].color = tool == "brush" ? selectedColor : boardColor;
      } else {
        if (temporaryColor) {
          grid[temporaryColor.y][temporaryColor.x].color = temporaryColor.color;
          temporaryColor = null;
        }
        if (!grid[y][x].colored) {
          grid[y][x].color = boardColor;
        }
      }
      grid[y][x].show();
    }
  }
}

function mousePressed() {
  pressed = true;
}

function mouseReleased() {
  pressed = false;
}
