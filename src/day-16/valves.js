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

function memoKey(valve, openValves, timeRemaining) {
  let openStr = [...openValves].sort().join(',');
  return `${valve}::${openStr}::${timeRemaining}`;
}

function findMostFlow(valve, openValves, timeRemaining) {
  if(timeRemaining === 0) return 0;

  const key = memoKey(valve, openValves, timeRemaining);
  if(stateMemoMap.has(key)) return stateMemoMap.get(key);

  let flow = openValves.reduce((sum, valve) => {
    return sum + valveMap.get(valve).flowRate;
  }, 0);

  if(openValves.length === valvesWithFlow.length) { // all valves are open
    return flow * timeRemaining;
  }

  let answer = 0;

  if (!openValves.includes(valve) && valveMap.get(valve).flowRate) { // open current valve
    answer = findMostFlow(valve, [...openValves, valve], timeRemaining - 1);
  } 

  valveMap.get(valve).tunnels.forEach(v => {
    let optVal = findMostFlow(v, [...openValves], timeRemaining - 1);
    if(optVal > answer) answer = optVal;
  });

  stateMemoMap.set(memoKey(valve, openValves, timeRemaining), answer + flow);
  return answer + flow;
}


console.log(findMostFlow('AA', [], 30));