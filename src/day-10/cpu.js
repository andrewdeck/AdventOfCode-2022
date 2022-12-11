import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

class CPU {
  constructor() {
    this.register = 1;
    this.cycle = 0;
    this.signalForCycle = [];
  }

  // 20th, 60th, 100th, 140th, 180th, and 220th
  get signalStrength() {
    return this.signalForCycle.filter((_, index) => [20,60,100,140,180,220].includes(index)).reduce((sum, x) => x + sum, 0);
  }

  executeInstruction(instruction) {
    this.cycle++;
    if(instruction === 'noop') {
      this.storeSignalValue();
      return;
    }

    let [method, value] = instruction.split(' ');
    if(method === 'addx') {
      this.storeSignalValue();
      this.cycle++;
      this.storeSignalValue();
      this.register += Number(value);
    }
  }

  storeSignalValue() {
    this.signalForCycle[this.cycle] = this.cycle * this.register;
  }
}

function calculateSignalStrength(program) {
  const cpu = new CPU();
  const instructions = program.split('\n');

  instructions.forEach( int => {
    cpu.executeInstruction(int);
  });

  return cpu.signalStrength;
}


console.log(calculateSignalStrength(inputText));