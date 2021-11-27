const $ = document; // For shorter code
const artBoardWidthInp = $.querySelector("#board-width");
const artBoardHeightInp = $.querySelector("#board-height");
const brushColorInp = $.querySelector("#brush-color");
const popUp = $.querySelector(".popup");
let canvas = null;
let grid = null;
let cols = 0;
let rows = 0;
let boxSize = 31;
let selectedColor = null;
let pressed = false;
let temporaryColor = null;

brushColorInp.addEventListener("change", () => {
  selectedColor = brushColorInp.value;
});

popUp.addEventListener("submit", (event) => {
  event.preventDefault();

  canvas.setAttribute("width", artBoardWidthInp.value + "px");
  canvas.setAttribute("height", artBoardHeightInp.value + "px");

  canvas.removeAttribute("style");
  $.querySelector(".popup-container").style.display = "none";
  cols = Math.floor(canvas.width / boxSize);
  rows = Math.floor(canvas.height / boxSize);
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

function Pixel(x, y) {
  this.color = 255;
  this.colored = false;

  this.show = function () {
    fill(color(this.color));
    stroke(0);
    rect(x * boxSize, y * boxSize, boxSize, boxSize);
  };
}

function setup() {
  createCanvas();
  canvas = $.querySelector("#defaultCanvas0");

  selectedColor = color(brushColorInp.value);
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
          grid[y][x].colored = true;
          grid[y][x].color = selectedColor;
          grid[y][x].show();
        }
        if (grid[y][x].colored){
            temporaryColor = {x, y, color : grid[y][x].color};
        }
        grid[y][x].color = selectedColor;
      } else {
        if (temporaryColor){
            grid[temporaryColor.y][temporaryColor.x].color = temporaryColor.color;
            temporaryColor = null;
        }
        if (!grid[y][x].colored) {
          grid[y][x].color = 255;
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
