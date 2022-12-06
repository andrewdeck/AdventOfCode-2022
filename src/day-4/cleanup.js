import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = `2-4,6-8
// 2-3,4-5
// 5-7,7-9
// 2-8,3-7
// 6-6,4-6
// 2-6,4-8`;

class ElfPair {
  constructor(string) {
    let [left, right] = string.split(',');
    this.leftElf = {
      start: Number(left.split('-')[0]),
      end: Number(left.split('-')[1]),
    }
    this.rightElf = {
      start: Number(right.split('-')[0]),
      end: Number(right.split('-')[1]),
    }
  }

  get overlap() {
    let hasOverlap = false;
    if(this.leftElf.start <= this.rightElf.start && this.leftElf.end >= this.rightElf.end ) hasOverlap = true;
    else if(this.rightElf.start <= this.leftElf.start && this.rightElf.end >= this.leftElf.end ) hasOverlap = true;
    // if(hasOverlap) console.log(this.leftElf, this.rightElf);
    return hasOverlap;
  }
}

const pairs = inputText.split('\n').map( row => new ElfPair(row));

console.log(pairs.filter(x => x.overlap).length);