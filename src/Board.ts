import * as _ from 'lodash';

import { BoardTile } from './Tile';

export interface Board {
  tiles: BoardTile[];
  size: number;
}

export function findWords(board: Board): BoardTile[][] {
  // This can probably be WAY more efficient, but I bet it also doesn't matter.
  // N will always be small (until we make InifiniScrabble!)

  const tileArray = _.keyBy(board.tiles, (tile) => `${tile.y},${tile.x}`);
  let words: BoardTile[][] = [];

  const nextRightTile = (tile: BoardTile): BoardTile|null => {
    return tileArray[`${tile.y},${tile.x + 1}`];
  };

  const nextBelowTile = (tile: BoardTile): BoardTile|null => {
    return tileArray[`${tile.y + 1},${tile.x}`];
  };

  for (var y = 0; y < board.size; y++) {
    for (var x = 0; x < board.size; x++) {
      const tile = tileArray[`${y},${x}`];
      if (!tile) { continue; }

      const leftTile = tileArray[`${y},${x - 1}`],
           rightTile = tileArray[`${y},${x + 1}`],
           aboveTile = tileArray[`${y - 1},${x}`],
           belowTile = tileArray[`${y + 1},${x}`];

      if (rightTile && !leftTile) {
        let word: BoardTile[] = [tile];

        let currentTile: BoardTile|null = rightTile;
        while (currentTile) {
          word.push(currentTile);
          currentTile = nextRightTile(currentTile);
        }

        words.push(word);
      }

      if (belowTile && !aboveTile) {
        let word: BoardTile[] = [tile];

        let currentTile: BoardTile|null = belowTile;
        while (currentTile) {
          word.push(currentTile);
          currentTile = nextBelowTile(currentTile);
        }

        words.push(word);
      }
    }
  }

  return words;
}

export function checkWord(tiles: BoardTile[]): boolean {
  const word = _(tiles).chain()
    .sortBy((tile) => tile.y * 10 + tile.x)
    .map((tile) => tile.letter)
    .value()
    .join('');

  console.log(word);

  const dict = ['cat', 'dog'];
  return _.includes(dict, word.toLowerCase());
}

// TODO: Return something more complex
export function checkBoard(board: Board): boolean {
  return findWords(board)
    .map(checkWord)
    .reduce(((prev, current) => prev && current), true);
}