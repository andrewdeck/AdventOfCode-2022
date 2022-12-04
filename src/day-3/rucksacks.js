import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');

const priority = char => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char) + 1;

let totalPriority = 0;

inputText.split('\n').forEach(row => {
  let compartmentOne = row.substring(0, row.length/2),
      compartmentTwo = row.substring(row.length/2);

  let setForTwo = new Set([...compartmentTwo]);

  const sharedItem = [...compartmentOne].find(x => setForTwo.has(x));
  console.log(sharedItem);

  totalPriority += priority(sharedItem);
});

console.log(totalPriority);
