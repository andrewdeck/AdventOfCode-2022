import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

const coordKey = ([x,y,z]) => `${x}:${y}:${z}`;

const cubeMap = new Map();

inputText.split('\n').forEach(line => {
  let [x,y,z] = line.split(',').map(Number);
  let key = coordKey([x,y,z]);
  cubeMap.set(key, [x,y,z]);
});

let exposedFaces = 0;

for(const [key, value] of cubeMap) {
  for(const cIdx of [0,1,2]) {
    for(const dC of [-1,1]) {
      let neighbor = [...value];
      neighbor[cIdx] += dC;
      if(!cubeMap.has(coordKey(neighbor))) exposedFaces++;
    }
  }
}

console.log(exposedFaces);