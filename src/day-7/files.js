import fs from 'fs';

// const inputText = fs.readFileSync('./input.txt', 'utf-8');
const inputText = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

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
    this.subDirs = [];
    this.files = [];
    this._size = null;
  }

  get size() {
    if(this._size) return this._size;
    let fileSize = this.files.reduce((sum, f) => sum + f.size, 0);
    let subDirSize = this.subDirs.reduce((sum, dir) => sum + dir.size, 0);
    this._size = fileSize + subDirSize;
    return this._size;
  }

  print() {
    let depth = 0;
    let ref = this.parentDirectory;
    while(ref) {
      depth++;
      ref = ref.parentDirectory;
    }
    let indent = '';
    for(let i =0; i<depth; i++) indent += '  ';
    // console.log(`${indent}${this.name}/ size=${this.size}`);
    console.log(`${indent}${this.name}/`);
    this.subDirs.forEach(dir => dir.print());
    this.files.forEach(file => { console.log(`${indent}  ${file.name} size=${file.size}`)});
  }
}

const directories = {};
const root = new Directory('/');
directories['/'] = root;

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
    else currentDirectory = currentDirectory.subDirs.find( x => x.name === arg);
  } else { // ls
    let list = chunk.slice(1);
    list.forEach(item => {
      let [sizeOrType, name] = item.split(' ');
      if(sizeOrType === 'dir') {
        let newDir = new Directory(name, currentDirectory);
        directories[name] = newDir;
        currentDirectory.subDirs.push(newDir);
      } else currentDirectory.files.push(new File(name, Number(sizeOrType)));
    })
  }
});

let sumBelowThreshold = 0;

Object.entries(directories).forEach(([name, directory]) => {
  if(directory.size <= MAX_DIR_SIZE) sumBelowThreshold += directory.size;
});

console.log(sumBelowThreshold);

root.print();