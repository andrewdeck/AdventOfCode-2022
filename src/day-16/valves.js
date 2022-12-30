import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');
// const inputText = fs.readFileSync('./example.txt', 'utf-8');

class Valve {
  constructor(id, flowRate, tunnels) {
    this.id = id;
    this.flowRate = flowRate;
    this.tunnels = tunnels;
  }
}

let valveMap = new Map();
let stateMemoMap = new Map();

// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
const valves = inputText.split('\n').map(line => {
  let id = line.substring(6,8);
  let [flow, rest] = line.slice(23).split('; ');
  let tunnels = rest.replace('tunnels lead to valves ', '').replace('tunnel leads to valve ', '').split(', ');
  let valve = new Valve(id, Number(flow), tunnels);
  valveMap.set(id, valve);

  return valve;
});

const valvesWithFlow = valves.filter(v => v.flowRate);

function memoKey(valve, openValves, timeRemaining, playersRemaining) {
  let openStr = [...openValves].sort().join(',');
  return `${valve}::${openStr}::${timeRemaining}::${playersRemaining}`;
}

function findMostFlow(valve, openValves, timeRemaining, playersRemaining) {
  // if(playersRemaining === 0) console.log(`Elephant starting: ${valvesWithFlow.length - openValves.length}`);
  if(timeRemaining === 0) {
    if(playersRemaining > 0 && openValves.length !== valvesWithFlow.length) return findMostFlow('AA', [...openValves], 26, playersRemaining - 1);
    else return 0;
  }

  const key = memoKey(valve, openValves, timeRemaining, playersRemaining);
  if(stateMemoMap.has(key)) {
    // console.log(`cache hit ${key}`);
    return stateMemoMap.get(key);
  }

  if(openValves.length === valvesWithFlow.length) { // all valves are open
    return 0;
  }

  let answer = 0;
  const {flowRate} = valveMap.get(valve);
  if (!openValves.includes(valve) && flowRate) { // open current valve
    answer = ((timeRemaining - 1) * flowRate) + findMostFlow(valve, [...openValves, valve], timeRemaining - 1, playersRemaining);
  } 

  valveMap.get(valve).tunnels.forEach(v => {
    let optVal = findMostFlow(v, [...openValves], timeRemaining - 1, playersRemaining);
    if(optVal > answer) answer = optVal;
  });

  stateMemoMap.set(key, answer);
  return answer;
}


console.log(findMostFlow('AA', [], 30, 0));