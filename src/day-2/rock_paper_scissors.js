import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'utf-8');

/**
 * Opponent:
 *    A: Rock, B: Paper, C: Scissors
 * Player
 *    X: Rock, Y: Paper, Z: Scissors
 */
const opponentLookup = {
  A: 'R',
  B: 'P',
  C: 'S'
};

const playerLookup = {
  X: 'R',
  Y: 'P',
  Z: 'S'
};

const games = inputText.split('\n').map(line => {
  let [opponent, player] = line.split(' ');
  // normalize the data
  return {
    opponent: opponentLookup[opponent],
    player: playerLookup[player],
  }
});

/**
 * will return: loss | draw | win
 */
const matchResult = ({opponent, player}) => {
  let result = null;
  if(opponent === player) result = 'draw';
  else if(opponent === 'R') {
    result = player === 'P' ? 'win' : 'loss';
  } else if (opponent === 'P') {
    result = player === 'S' ? 'win' : 'loss';
  } else { // opponent === 'S'
    result = player === 'R' ? 'win' : 'loss';
  }
  return result;
};

// 0 if you lost, 3 if the round was a draw, and 6 if you won
// 1 for Rock, 2 for Paper, and 3 for Scissors
const scores = {
  win: 6,
  draw: 3,
  loss: 0,
  R: 1,
  P: 2,
  S: 3,
};

let score = 0;

games.forEach( game => {
  let result = matchResult(game);
  score += scores[result];
  score += scores[game.player];
});

console.log(score);