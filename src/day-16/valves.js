import fs from 'fs';
import dijkstra from 'dijkstrajs';

// const inputText = fs.readFileSync('./input.txt', 'utf-8');
const inputText = fs.readFileSync('./example.txt', 'utf-8');

class Valve {
  constructor(id, flowRate, tunnels) {
    this.id = id;
    this.flowRate = flowRate;
    this.tunnels = tunnels;
  }
}

let valveMap = {};
let graph = {};

// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
const valves = inputText.split('\n').map(line => {
  let id = line.substring(6,8);
  let [flow, rest] = line.slice(23).split('; ');
  let tunnels = rest.replace('tunnels lead to valves ', '').replace('tunnel leads to valve ', '').split(', ');
  let valve = new Valve(id, Number(flow), tunnels);
  valveMap[id] = valve;

  let node = {};
  tunnels.forEach(tun => {
    node[tun] = 1;
  });
  graph[id] = node;
  return valve;
});

let mostFlow = 0;

const valvesWithFlow = valves.filter(v => v.flowRate);

function exploreOptions(nodeId, openValves = [], priorFlow = 0, minute = 1) {
  const valve = valveMap[nodeId];
  const flowForStep = openValves.map(id => valveMap[id].flowRate).reduce((sum, val) => sum + val, 0);
  const totalFlow = flowForStep + priorFlow;
  if(minute === 30) {
    // console.log(totalFlow, mostFlow);
    if(totalFlow > mostFlow) {
      mostFlow = totalFlow;
      console.log(`branch end: ${mostFlow}`);
    }
  } else if(openValves.length === valvesWithFlow.length) {
    // console.log('all valves open');
    let remainingMins = 30 - (minute + 1);
    let finalFlow = totalFlow + (remainingMins * flowForStep);
    // console.log(finalFlow, mostFlow);
    if(finalFlow > mostFlow) {
      mostFlow = finalFlow;
      console.log(`jump end: ${mostFlow}`);
    }
  } else {
    if(valve.flowRate !== 0 && !openValves.includes(nodeId)) {
      // console.log(`open valve: ${nodeId}`);
      exploreOptions(nodeId, [...openValves, nodeId], totalFlow, minute + 1);
    }
    let closedValves = valvesWithFlow.map(x=> x.id).filter( v => !openValves.includes(v));
    closedValves.filter(x => x !== nodeId).forEach( closedValve => {
      let path = dijkstra.find_path(graph, nodeId, closedValve);
      exploreOptions(path[1], [...openValves], totalFlow, minute + 1);
    });
  }
}



exploreOptions('AA');
console.log(mostFlow);