import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = `$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`;

const MAX_DIR_SIZE = 100000;

class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }
}

class Directory {
  constructor(name, parentDirectory) {
    this.name = name;
    this.parentDirectory = parentDirectory;
    this.items = [];
  }

  get size() {
    return this.items.reduce((sum, x) => sum + x.size, 0);
  }

  print() {
    let indent = '';
    let ref = this.parentDirectory;
    while(ref) {
      indent += '  ';
      ref = ref.parentDirectory;
    }
    console.log(`${indent}${this.name}/`);
    this.items.forEach(item => {
      if(item.print) item.print();
      else console.log(`${indent}  ${item.name} size=${item.size}`)
    })
  }
}

const directories = [];
const root = new Directory('/');
directories.push(root);

const commandChunks = inputText.split('\n').reduce((chunks, row) => {
  if(row.charAt(0) === '$') chunks.push([row]);
  else chunks[chunks.length - 1].push(row);
  return chunks;
}, []);


let currentDirectory = root;
commandChunks.forEach( chunk => {
  let [,cmd, arg] = chunk[0].split(' ');
  if(cmd === 'cd') {
    if(arg === '/') currentDirectory = root;
    else if(arg === '..') currentDirectory = currentDirectory.parentDirectory;
    else currentDirectory = currentDirectory.items.find( x => x.name === arg);
  } else { // ls
    let list = chunk.slice(1);
    list.forEach(item => {
      let [sizeOrType, name] = item.split(' ');
      if(sizeOrType === 'dir') {
        let newDir = new Directory(name, currentDirectory);
        directories.push(newDir);
        currentDirectory.items.push(newDir);
      } else currentDirectory.items.push(new File(name, Number(sizeOrType)));
    })
  }
});

let sumBelowThreshold = 0;

directories.forEach(directory => {
  if(directory.size <= MAX_DIR_SIZE) {
    sumBelowThreshold += directory.size;
  }
});

console.log(sumBelowThreshold);

// root.print();