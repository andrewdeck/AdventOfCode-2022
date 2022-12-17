import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./unit.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

const pairs = inputText.split('\n\n');

let allPackets = [
  [[2]],
  [[6]]
];

pairs.forEach( str => {
  allPackets.push(...str.split('\n').map(JSON.parse));
});

allPackets.sort((a, b) => isProperlyOrdered(a,b) ? -1 : 1);

let indexes = [];
allPackets.forEach((packet, index) => {
  let string = JSON.stringify(packet);
  if (string === '[[2]]' || string === '[[6]]') indexes.push(index + 1);
});
console.log(indexes[0] * indexes[1]);

// let score = 0;

// pairs.forEach((string, index) => {
//   let [left, right] = string.split('\n').map(JSON.parse);
//   debug();
//   debug(`== Pair ${index + 1} ==`);
//   if(isProperlyOrdered(left, right)) {
//     score += (index + 1);
//   }
// });

// console.log(score);

function isProperlyOrdered(left, right, level = 0) {
  debug(`- Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`, level);

  for(let i = 0; i < Math.max(left.length, right.length); i++) {
    let leftItem = left[i],
        rightItem = right[i];
    debug(`  - Compare ${JSON.stringify(leftItem)} vs ${JSON.stringify(rightItem)}`, level);
    const leftType = typeOf(leftItem),
          rightType = typeOf(rightItem);

    if(rightType === 'undefined') {
      debug(`    - Right side ran out of items, so inputs are not in the right order`);
      return false;
    } else if(leftType === 'undefined') {
      debug(`- Left side ran out of items, so inputs are in the right order`, level);
      return true;
    } else if(leftType !== rightType) {
      if(leftType === 'number') leftItem = [leftItem];
      else rightItem = [rightItem];
      let sub = isProperlyOrdered(leftItem, rightItem, level + 1);
      if(sub !== undefined) return sub;
    } else if( leftType === 'number') {
      if(leftItem < rightItem) {
        debug(`    - Left side is smaller, so inputs are in the right order`, level);
        return true
      } else if(rightItem < leftItem) {
        debug(`    - Right side is smaller, so inputs are not in the right order`);
        return false;
      }
    } else { // both lists
      let sub = isProperlyOrdered(leftItem, rightItem, level + 1);
      if(sub !== undefined) return sub;
    }
  }
}

function debug(output = '', level = 0) {
  let prefix = '';
  for(let x = 0; x < level; x++) prefix += '  ';
  // console.log(`${prefix}${output}`);
}

function typeOf(val) {
  return Array.isArray(val) ? 'array' : typeof val;
}

