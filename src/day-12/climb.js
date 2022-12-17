import fs from 'fs';
import dijkstra from 'dijkstrajs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

let start, end;
const grid = inputText.split('\n').map((line, y) => [...line].map((char, x) => {
  if(char === 'S') {
    start = {x, y};
    return 'a'.charCodeAt(0);
  } else if(char === 'E') {
    end = {x, y};
    return 'z'.charCodeAt(0);
  }
  return char.charCodeAt(0);
}));

const nodeId = (x,y) => `${x}:${y}`;

function generateGraph(grid) {
  let graph = {};
  for(let y = 0; y < grid.length; y++) {
    let row = grid[y];
    for(let x = 0; x < row.length; x++) {
      let local = grid[y][x];
      let node = {};
      if(grid[y - 1] && grid[y - 1][x] <= local + 1) node[nodeId(x,y - 1)] = 1; // up
      if(grid[y + 1] && grid[y + 1][x] <= local + 1) node[nodeId(x,y + 1)] = 1; // down
      if(grid[y][x - 1] <= local + 1) node[nodeId(x - 1,y)] = 1; // left
      if(grid[y][x + 1] <= local + 1) node[nodeId(x + 1,y)] = 1; // right
      graph[nodeId(x,y)] = node;
    }
  }
  return graph;
}

const graph = generateGraph(grid);

let path = dijkstra.find_path(graph, nodeId(start.x, start.y), nodeId(end.x, end.y));
console.log(path.length -1); // includes starting point