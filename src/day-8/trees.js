import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = `30373
// 25512
// 65332
// 33549
// 35390`;

const trees = inputText.split('\n').map(x => x.split('').map(Number));

function countVisibleTrees(grid) {
  const firstRow = grid[0];
  const outerTrees = (grid.length * 2) + ((firstRow.length - 2) * 2);
  let visibleTrees = 0;
  for(let x = 1; x < firstRow.length - 1; x ++) {
    for(let y = 1; y < grid.length - 1; y++) {
      if(treeIsVisible({x, y, grid})) visibleTrees++;
    }
  }

  return outerTrees + visibleTrees;
}

function treeIsVisible({x, y, grid}) {
  let height = grid[y][x];
  let gridWidth = grid[0].length;

  for(let i = x - 1; i >= 0; i--) { //left
    let h = grid[y][i];
    if(h >= height) break;
    if(i === 0) return true;
  }
  for(let i = x + 1; i < gridWidth; i++) { //right
    let h = grid[y][i];
    if(h >= height) break;
    if(i === gridWidth - 1) return true;
  }
  for(let i = y - 1; i >= 0; i--) { //down
    let h = grid[i][x];
    if(h >= height) break;
    if(i === 0) return true;
  }
  for(let i = y + 1; i < gridWidth; i++) { //up
    let h = grid[i][x];
    if(h >= height) break;
    if(i === gridWidth - 1) return true;
  }


  return false;
}
console.log(countVisibleTrees(trees));
