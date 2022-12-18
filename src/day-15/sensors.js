import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

class Sensor {
  constructor(coords, closestBeacon) {
    this.x = coords.x;
    this.y = coords.y;
    this.closestBeacon = closestBeacon;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  get range() {
    return manhattanDistance({x: this.x, y: this.y}, this.closestBeacon);
  }

  canReachY(y) {
    return this.range >= Math.abs(this.y - y);
  }
}

const sensors = inputText.split('\n').map(line => {
  const [sensor, beacon] = line.replace('Sensor at ','').replace(' closest beacon is at ','').split(':');
  return new Sensor(extractCoords(sensor), extractCoords(beacon));
});
const beacons = sensors.map(x => x.closestBeacon);


function extractCoords(str) {
  const [x, y] = str.replace('x=','').replace(' y=','').split(',').map(Number);
  return {x,y};
}

function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// const Y_LEVEL = 2000000;
// let row = {};
// // mark all Y that are in range
// sensors.forEach(sensor => {
//   if(sensor.canReachY(Y_LEVEL)) {
//     const pos = sensor.position;
//     const distance = manhattanDistance(pos, {x: pos.x, y: Y_LEVEL});
//     const reach = sensor.range - distance;
    
//     for(let x = pos.x - reach; x <= pos.x + reach; x++) {
//       row[x] = true;
//     }
//   }
// });

// // remove actual beacons
// beacons.forEach(({x,y}) => {
//   if(y === Y_LEVEL && row[x]) delete row[x];
// });

// console.log(Object.keys(row).length);

console.time('part2');
const MIN = 0, MAX = 4000000;
// const MIN = 0, MAX = 20;
sensors.forEach(sensor => {
  // has to be just outside of sensor range, so look there
  const pos = sensor.position;
  
  let look = { x: pos.x + sensor.range + 1, y: pos.y }; // start on the right, and rotate clockwise
  while(look.x !== pos.x) {
    look = {x: look.x-1, y: look.y-1};
    if(outOfRange(look)) continue;
    checkPosition(look);
  }
});

function outOfRange({x, y}) {
  return x < MIN || y < MIN || x > MAX || y > MAX;
}

function checkPosition({x, y}) {
  let outOfAllSensorsRange = true;
  for(let s = 0; s < sensors.length; s++) {
    let sensor = sensors[s];
    if(manhattanDistance(sensor.position, {x,y}) <= sensor.range) {
      outOfAllSensorsRange = false;
      break; 
    }
  }
  if(outOfAllSensorsRange) {
    console.log(x,y);
    console.log( (4000000 * x) + y );
    console.timeEnd('part2');
    process.exit();
  }
}