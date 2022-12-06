import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = "bvwbjplbgvbhsrlpgdmjqwftvncz";//: first marker after character 5
// nppdvjthqldpwncqszvftbrmjlhg: first marker after character 6
// nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 10
// zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 11

function charsBeforeMarker(string) {
  let index = 0;

  for(let i = 0; i<string.length; i++) {
    let set = new Set([...string.substr(i,4)]);
    if(set.size === 4) {
      index = i + 4;
      break;
    }
  }
  return index;
}

console.log(charsBeforeMarker(inputText));