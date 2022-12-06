import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = `    [D]    
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2`;

const [state, instructions] = inputText.split('\n\n');

function chunk(string) {
  const values = [];
  for(let i = 1; i < string.length; i += 4 ) {
    values.push(string[i]);
  }
  return values;
}

class Ship {
  constructor(state) {
    let rows = state.split('\n');
    let indexes = chunk(rows.slice(-1)[0]).map(Number);
    let stackCount = indexes.length;

    let stacks = [...Array(stackCount)].map(() => []);

    for(let i = rows.length - 2; i >= 0; i--) {
      let crates = chunk(rows[i]);
      for(let j = 0; j < crates.length; j++) {
        let crate = crates[j];
        if(crate !== ' ') stacks[j].push(crate);
      }
    }
    this.indexes = indexes;
    this.stacks = stacks;
  }

  handleInstruction(instruction) {
    let [, count,, start,, end] = instruction.split(' ').map(Number);
    let crates = this.stacks[start - 1].splice(-1 * count);
    this.stacks[end - 1].push(...crates);
  }

  topCrates() {
    return this.stacks.map(x => x[x.length-1]).join('');
  }
}

const ship = new Ship(state);

instructions.split('\n').forEach( x => ship.handleInstruction(x));

console.log(ship.topCrates());