import fs, { link } from 'fs';

// const inputText = fs.readFileSync('./input.txt', 'utf-8');
const inputText = fs.readFileSync('./example.txt', 'utf-8');

const inputArray = inputText.split('\n').map(Number);

class LinkedListNode {
  constructor(value, id) {
    this.id = id;
    this.value = value;
    this.next = null;
    this.prev = null;
  }

  moveForward() {
    // a (b) c d
    const a = this.prev,
          b = this,
          c = this.next,
          d = c.next;
    // a c (b) d
    a.next = c;
    c.next = b;
    b.next = d;
    d.prev = b;
    b.prev = c;
    c.prev = a;
  }

  moveBackward() {
    // a b (c) d
    const c = this,
          d = c.next,
          b = c.prev,
          a = b.prev;
    
    // a (c) b d
    a.next = c;
    c.next = b;
    b.next = d;
    d.prev = b;
    b.prev = c;
    c.prev = a;
  }

  debugPrint() {
    console.log(`${this.prev.value}\t<\t${this.value}\t>\t${this.next.value}`);
  }
}

class CircularLinkedList {
  constructor(arrayOfNums) {
    let nodeMap = new Map();
    const LENGTH = arrayOfNums.length;

    // first create unlinked nodes
    for(const num of arrayOfNums) {
      let node = new LinkedListNode(num);
      nodeMap.set(num, node);
    }

    // link nodes circularly
    arrayOfNums.forEach((num, index) => {
      let node = nodeMap.get(num);
      if(!node) console.log(num, index);
      if(index === 0) {
        node.prev = nodeMap.get(arrayOfNums[LENGTH - 1]);
        node.next = nodeMap.get(arrayOfNums[1]);
      } else if(index === LENGTH - 1) {
        node.prev = nodeMap.get(arrayOfNums[index - 1]);
        node.next = nodeMap.get(arrayOfNums[0]);
      } else {
        node.prev = nodeMap.get(arrayOfNums[index - 1]);
        node.next = nodeMap.get(arrayOfNums[index + 1]);
      }
    });
    this.size = arrayOfNums.length;
    this.firstNode = nodeMap.get(arrayOfNums[0]);
  }

  find(num) {
    let failsafe = 0;
    let node = this.firstNode;
    while(node.value !== num) {
      failsafe++;
      node = node.next;
      if(failsafe > 2 * this.size) throw new Error(`the list seems to have broken, cannot find: ${num}`);
    }
    return node;
  }

  move(number) {
    let node = this.find(number);
    let count = Math.abs(number);

    for(let c = 0; c < count; c++) {
      if(number < 0 ) {
        if(node === this.firstNode) this.firstNode = node.prev;
        // console.log('\nnode.moveBackward()', c);
        node.moveBackward();
      } else {
        if(node === this.firstNode) this.firstNode = node.next;
        // console.log('\nnode.moveForward()', c);
        node.moveForward();
      }

      // this.print();
    }
    return node;
  }

  print() {
    let output = '';
    let node = this.firstNode;
    
    for(let i = 0; i < this.size; i++){
      output += `${node.value}, `;
      node = node.next;
    }
    console.log(output);
  }
}

const linkedList = new CircularLinkedList(inputArray);

function mixFile() {
  // inputArray.forEach( num => linkedList.find(num));

  inputArray.forEach((number, index) => {
    // console.log(index, number);
    let node = linkedList.move(number);
    // inputArray.forEach( num => linkedList.find(num));
    // console.log();
    // console.log(`${number} moves between ${node.prev.value} and ${node.next.value}:`)
    // linkedList.print();
  });
}

mixFile();
linkedList.print();

let node = linkedList.find(0);
let groveSum = 0;
for(let pos = 1; pos <= 3000; pos++) {
  node = node.next;
  if(pos % 1000 === 0) {
    console.log(`${pos}th: ${node.value}`);
    groveSum += node.value;
  }
}

console.log(groveSum);

