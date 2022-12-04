import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = `vJrwpWtwJgWrhcsFMMfFFhFp
// jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
// PmmdzqPrVvPwwTWBwg
// wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
// ttgJtRGJQctTZtZT
// CrZsJsPPZsGzwwsLwLmpwMDw`;

const priority = char => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char) + 1;

let totalPriority = 0;

// part 1
// inputText.split('\n').forEach(row => {
//   let compartmentOne = row.substring(0, row.length/2),
//       compartmentTwo = row.substring(row.length/2);

//   let setForTwo = new Set([...compartmentTwo]);

//   const sharedItem = [...compartmentOne].find(x => setForTwo.has(x));
//   console.log(sharedItem);

//   totalPriority += priority(sharedItem);
// });

// console.log(totalPriority);

let rows = inputText.split('\n');

for(let i = 0; i < rows.length; i += 3) {
  let elfOne = new Set([...rows[i]]),
      elfTwo = new Set([...rows[i+1]]),
      elfThree = new Set([...rows[i+2]]);

  let firstTwoShared = new Set([...elfOne].filter(x => elfTwo.has(x)));

  const badge = [...elfThree].find(x => firstTwoShared.has(x));

  totalPriority += priority(badge);
}

console.log(totalPriority);