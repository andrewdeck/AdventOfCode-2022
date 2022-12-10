import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = `R 5
// U 8
// L 8
// D 3
// R 17
// D 10
// L 25
// U 20`;

const posKey = ({x, y}) => `${x},${y}`;

const NUM_KNOTS = 10;

const knots = [...Array(NUM_KNOTS)].map(() => { return {x: 0, y: 0} });

let tailLocations = new Set();

let max = {x: 5, y: 5},
    min = {x: -5, y: -5};

inputText.split('\n').forEach(row => {
  let [direction, distance] = row.split(' ');
  moveHead(direction, Number(distance));
  // debug(row);
});

function moveHead(direction, distance) {
  let head = knots[0];
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
    if(head.x > max.x) max.x = head.x;
    if(head.y > max.y) max.y = head.y;
    if(head.x < min.x) min.x = head.x;
    if(head.y < min.y) min.y = head.y;

    for(let j = 1; j < NUM_KNOTS; j++) {
      let front = knots[j - 1],
          back = knots[j];
      if(knotsAreTouching(front, back)) break;
      else moveTrailingKnot(front, back);
    }
    tailLocations.add(posKey(knots[NUM_KNOTS - 1]));
  }
}

function knotsAreTouching(front, back) {
  let xDiff = Math.abs(front.x - back.x),
      yDiff = Math.abs(front.y - back.y);
  return xDiff < 2 && yDiff < 2;
}

function moveTrailingKnot(front, back) {
  let xDiff = front.x - back.x,
      yDiff = front.y - back.y;
  
  if(Math.abs(xDiff) === 2 && Math.abs(yDiff) === 2) {
    back.x = front.x - (xDiff / 2);
    back.y = front.y - (yDiff / 2);
  } else if(Math.abs(xDiff) === 2) {
    back.x = front.x - (xDiff / 2);
    back.y = front.y;
  } else {
    back.x = front.x;
    back.y = front.y - (yDiff / 2);
  }
}

function debug(instruction) {
  console.log();
  console.log(instruction);
  // console.log(knots);

  for(let y = max.y; y >= min.y; y--) {
    let row = ``;
    for(let x = min.x; x <= max.x; x++) {
      let index = knots.findIndex(k => k.x === x && k.y === y);
      if(x === 0 && y === 0) row += index === -1 ? 's' : index;
      else row += index === -1 ? '.' : index;
    }
    console.log(row);
  }
}

console.log(tailLocations.size);