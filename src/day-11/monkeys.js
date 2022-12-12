import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

class Monkey {
  constructor(items, operation, test, successMonkey, failureMonkey) {
    this.itemsInspected = 0;
    this.items = items;
    this.operation = operation;
    this.test = test;
    this.successMonkey = successMonkey;
    this.failureMonkey = failureMonkey;
  }

  giveItem(item) {
    this.items.push(item);
  }

  processItems() {
    let deliveries = [];
    this.items.forEach( item => {
      this.itemsInspected++;
      item = this.operation(item);
      item = Math.floor(item / 3);
      deliveries.push({
        item,
        recipient: this.test(item) ? this.successMonkey : this.failureMonkey
      });
    });
    this.items = [];
    return deliveries;
  }
}

function createTestFunc(testStr) {
  let num = testStr.split(' ').slice(-1)[0];
  num = Number(num);
  return worry => worry % num === 0;
}

function createOpFunc(opStr) {
  let [operator, value] = opStr.replace('  Operation: new = old ','').split(' ');

  if(value === 'old') {
    if(operator === '*') return worry => worry * worry;
    else if(operator === '+') return worry => worry + worry;
  } else {
    let num = Number(value);
    if(operator === '*') return worry => worry * num;
    else if(operator === '+') return worry => worry + num;
  }
}

const monkeys = [];

let blobs = inputText.split('\n\n');
blobs.forEach( blob => {
  const lines = blob.split('\n');
  const monkeyId = Number(lines[0].replace('Monkey ', '').replace(':',''));
  const items = lines[1].replace('  Starting items: ','').split(', ').map(Number);
  const opFunc = createOpFunc(lines[2]);
  const testFunc = createTestFunc(lines[3]);
  const successMonkey = Number(lines[4].split(' ').slice(-1)[0]);
  const failureMonkey = Number(lines[5].split(' ').slice(-1)[0]);
  
  const monkey = new Monkey(items, opFunc, testFunc, successMonkey, failureMonkey);
  monkeys[monkeyId] = monkey;
});

for(let round = 0; round < 20; round++) {
  monkeys.forEach( monkey => {
    let items = monkey.processItems();
    items.forEach(({item, recipient}) => {
      monkeys[recipient].giveItem(item);
    });
  });
}

monkeys.sort((a,b) => a.itemsInspected - b.itemsInspected);
console.log(monkeys.slice(-2).reduce((a, b) => a * b.itemsInspected, 1));