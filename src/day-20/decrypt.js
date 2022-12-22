import fs, { link } from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

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
    let nodeArray = [];
    const LENGTH = arrayOfNums.length;

    // first create unlinked nodes
    arrayOfNums.forEach((num, idx) => {
      let node = new LinkedListNode(num, idx);
      nodeArray[idx] = node;
    });

    // link nodes circularly
    arrayOfNums.forEach((num, index) => {
      let node = nodeArray[index];
      if(index === 0) {
        node.prev = nodeArray[LENGTH - 1];
        node.next = nodeArray[1];
      } else if(index === LENGTH - 1) {
        node.prev = nodeArray[index - 1];
        node.next = nodeArray[0];
      } else {
        node.prev = nodeArray[index - 1];
        node.next = nodeArray[index + 1];
      }
    });
    this.size = arrayOfNums.length;
    this.firstNode = nodeArray[0];
  }

  find(index) {
    let failsafe = 0;
    let node = this.firstNode;
    while(node.id !== index) {
      failsafe++;
      node = node.next;
      if(failsafe > 2 * this.size) throw new Error(`the list seems to have broken, cannot find: ${index}`);
    }
    return node;
  }

  findZero() {
    let failsafe = 0;
    let node = this.firstNode;
    while(node.value !== 0) {
      failsafe++;
      node = node.next;
      if(failsafe > 2 * this.size) throw new Error(`the list seems to have broken, cannot find: ${index}`);
    }
    return node;
  }

  move(index) {
    let node = this.find(index);
    const number = node.value;
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
    let node = linkedList.move(index);
    // inputArray.forEach( num => linkedList.find(num));
    // console.log();
    // console.log(`${number} moves between ${node.prev.value} and ${node.next.value}:`)
    // linkedList.print();
  });
}

mixFile();
// linkedList.print();

let node = linkedList.findZero();
let groveSum = 0;
for(let pos = 1; pos <= 3000; pos++) {
  node = node.next;
  if(pos % 1000 === 0) {
    console.log(`${pos}th: ${node.value}`);
    groveSum += node.value;
  }
}

console.log(groveSum);

