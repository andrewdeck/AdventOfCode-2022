import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = `R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2`;

const posKey = ({x, y}) => `${x},${y}`;

let head = { x: 0, y: 0},
    tail = { x: 0, y: 0};

let tailLocations = new Set();
tailLocations.add(posKey(tail));

inputText.split('\n').forEach(row => {
  let [direction, distance] = row.split(' ');
  moveHead(direction, Number(distance));
});

function moveHead(direction, distance) {
  for(let i = 0; i < distance; i++) {
    if(direction === 'U') {
      head.y++;
    } else if (direction === 'D') {
      head.y--;
    } else if (direction === 'L') {
      head.x--;
    } else if (direction === 'R') {
      head.x++;
    }

    if(!tailIsTouchingHead()) moveTail(direction);
  }
}

function tailIsTouchingHead() {
  let xDiff = Math.abs(head.x - tail.x),
      yDiff = Math.abs(head.y - tail.y);
  return xDiff < 2 && yDiff < 2;
}

function moveTail(direction) {
  let {x, y} = head;
  if(direction === 'U') {
    tail = { x, y: head.y - 1 };
  } else if (direction === 'D') {
    tail = { x, y: head.y + 1 };
  } else if (direction === 'L') {
    tail = { x: x + 1, y };
  } else if (direction === 'R') {
    tail = { x: x - 1, y };
  }

  tailLocations.add(posKey(tail));
}

console.log(tailLocations.size);