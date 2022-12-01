import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');

class Elf {
  constructor(bag = []) {
    this.bag = bag;
  }

  get totalCalories() {
    return this.bag.reduce((sum, x) => sum + x, 0);
  }
}

const elves = [];

// process the input
let bag = [];
inputText.split('\n').forEach( row => {
  if(row !== '') {
    bag.push(Number(row));
  } else {
    elves.push(new Elf(bag));
    bag = [];
  }
});

elves.sort((a, b) => a.totalCalories - b.totalCalories);
console.log(elves[elves.length - 1].totalCalories);

const topThree = elves.slice(-3);
console.log(topThree.reduce((sum, elf) => elf.totalCalories + sum, 0));