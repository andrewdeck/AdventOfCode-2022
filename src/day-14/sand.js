import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

const ROCK = '#',
      SAND = 'o',
      AIR  = '.';

const rocks = inputText.split('\n').map(line => line.split(' -> ').map(coords => coords.split(',').map(Number)));

let furthestLeft = 500;
let deepestHeight = 0;

rocks.forEach(vectors => {
  vectors.forEach(([x,y]) => {
    if(x < furthestLeft) furthestLeft = x;
    if(y > deepestHeight) deepestHeight = y;
  })
});

const offsetRocks = rocks.map(vectors => vectors.map(([x,y]) => [x - furthestLeft, y])); // leave 1 space to the left in coordinates

let cave = [...Array(deepestHeight + 2)].map(() => []);

// fill in rocks
offsetRocks.forEach(vectors => {
  let previousPoint = vectors[0];
  
  for(let idx = 1; idx < vectors.length; idx++) {
    let currentPoint = vectors[idx];
    let dirIdx = 0; // which part of the tuple is changed
    if(previousPoint[1] !== currentPoint[1]) dirIdx = 1;
    let distance = currentPoint[dirIdx] - previousPoint[dirIdx];
    const direction = distance/Math.abs(distance);

    for(let c = 0; c <= Math.abs(distance); c++) {
      let rock = [...previousPoint];
      rock[dirIdx] = rock[dirIdx] + (c * direction);
      let [x, y] = rock;
      cave[y][x] = ROCK;
    }

    previousPoint = currentPoint;
  }
});

function printCave() {
  let width = cave.reduce((w, row) => Math.max(w, row.length), 0);
  for(let y = 0; y < cave.length; y++) {
    let line = '';
    for(let x = 0; x < width; x++) {
      line += cave[y][x] ? cave[y][x] : AIR;
    }
    console.log(line);
  }
}

// let the sand fall
let grains = 0;
let fellBelowBottom = false;
while(!fellBelowBottom) {
  let grain = [500 - furthestLeft, 0];

  while(grain[1] < deepestHeight) {
    let [x,y] = grain;
    // 1. down
    // 2. down-left
    // 3. down-right
    if(!cave[y+1][x]) grain = [x, y+1];
    else if(!cave[y+1][x-1]) grain = [x-1, y+1];
    else if(!cave[y+1][x+1]) grain = [x+1, y+1];
    else { // final resting place
      cave[y][x] = SAND;
      grains++;
      break;
    }
    if(grain[1] >= deepestHeight) {
      fellBelowBottom = true;
      break;
    }
  }
}

printCave();
console.log(grains);