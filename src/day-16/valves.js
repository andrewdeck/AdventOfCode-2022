import fs from 'fs';

// const inputText = fs.readFileSync('./input.txt', 'utf-8');
const inputText = fs.readFileSync('./example.txt', 'utf-8');

const TURN_ON_VALVE = 'turn_on_valve',
      MOVE = 'move';

class Valve {
  constructor(id, flowRate, tunnels) {
    this.id = id;
    this.flowRate = flowRate;
    this.tunnels = tunnels;
  }

  choices(isOn) {
    let choices = [];
    if(this.flowRate !== 0 && !isOn) choices.push({action: TURN_ON_VALVE});
    choices.push(...this.tunnels.map(tun => {return {action: MOVE, valve: tun}}))
    return choices;
  }
}

let valveMap = {};

// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
const valves = inputText.split('\n').map(line => {
  let id = line.substring(6,8);
  let [flow, rest] = line.slice(23).split('; ');
  let tunnels = rest.replace('tunnels lead to valves ', '').replace('tunnel leads to valve ', '').split(', ');
  let valve = new Valve(id, Number(flow), tunnels);
  valveMap[id] = valve;
  return valve;
});

let mostFlow = 0;

const valvesWithFlow = valves.filter(v => v.flowRate);

function exploreOptions(nodeId, openValves = [], priorFlow = 0, minute = 1) {
  let valve = valveMap[nodeId];
  const choices = valve.choices(openValves.includes(nodeId));
  const totalFlow = openValves.map(id => valveMap[id].flowRate).reduce((sum, val) => sum + val, 0) + priorFlow;
  if(minute === 30) {
    if(totalFlow > mostFlow) {
      console.log(mostFlow);
      mostFlow = totalFlow;
    }
  } else if(openValves.length !== valvesWithFlow.length) {
    choices.forEach(({action, valve}) => {
      if(action === MOVE) {
        exploreOptions(valve, [...openValves], totalFlow, minute + 1);
      } else {
        exploreOptions(nodeId, [...openValves, nodeId], totalFlow, minute + 1);
      }
    });
  } else {
    exploreOptions(nodeId, openValves, totalFlow, minute + 1);
  }
}

exploreOptions('AA');
console.log(mostFlow);