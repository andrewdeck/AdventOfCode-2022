import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

class CPU {
  constructor() {
    this.register = 1;
    this.cycle = -1;
    this.signalForCycle = [];
    this.ram = [];
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

  printScreen() {
    for(let y = 0; y < 6; y++) {
      let line = '';
      for(let x = 0; x < 40; x++) {
        let spritePos = this.ram[(y * 40) + x];
        line += Math.abs(spritePos - x) < 2 ? '#' : '.';
      }
      console.log(line);
    }
  }

  storeSignalValue() {
    this.ram[this.cycle] = this.register;
    this.signalForCycle[this.cycle + 1] = (this.cycle + 1) * this.register;
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

function renderScreen(program) {
  const cpu = new CPU();
  const instructions = program.split('\n');

  instructions.forEach( int => {
    cpu.executeInstruction(int);
  });

  cpu.printScreen();
}

renderScreen(inputText);
console.log(calculateSignalStrength(inputText));