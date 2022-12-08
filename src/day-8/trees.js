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
  const height = grid[y][x];
  const gridWidth = grid[0].length;

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
// console.log(countVisibleTrees(trees));

function scenicScore({x, y, grid}) {
  const height = grid[y][x];
  const gridWidth = grid[0].length;

  let up = 0, down = 0, left = 0, right = 0;

  for(let i = x - 1; i >= 0; i--) { //left
    let h = grid[y][i];
    left++;
    if(h >= height) break;
  }
  for(let i = x + 1; i < gridWidth; i++) { //right
    let h = grid[y][i];
    right++;
    if(h >= height) break;
  }
  for(let i = y - 1; i >= 0; i--) { //down
    let h = grid[i][x];
    down++;
    if(h >= height) break;
  }
  for(let i = y + 1; i < gridWidth; i++) { //up
    let h = grid[i][x];
    up++;
    if(h >= height) break;
  }
  return up * down * left * right;
}

function findHighestScenicScore(grid) {
  const firstRow = grid[0];
  let highestScore = 0;

  for(let x = 1; x < firstRow.length - 1; x ++) {
    for(let y = 1; y < grid.length - 1; y++) {
      let score = scenicScore({x, y, grid});
      if(score > highestScore) highestScore = score;
    }
  }
  return highestScore;
}

console.log(findHighestScenicScore(trees));
