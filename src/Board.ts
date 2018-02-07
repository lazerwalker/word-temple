import * as _ from 'lodash';

import { Tile, BoardTile, BoardTileState } from './Tile';
const Dictionary = require('./dictionary');

export interface Board {
  tiles: BoardTile[];
  size: number;
}

export function boardByAddingTile(
  board: Board,
  tile: Tile,
  position: { x: number; y: number }
) {
  let newTile = { ...tile, ...position };

  let newBoard = { ...board };
  newBoard.tiles = board.tiles.slice(0);
  newBoard.tiles.push(newTile);

  let validity = checkBoard(newBoard);

  newBoard.tiles.forEach(t => {
    if (_.includes(validity.validTiles, t)) {
      t.validity = BoardTileState.Valid;
    } else if (_.includes(validity.invalidTiles, t)) {
      t.validity = BoardTileState.Invalid;
    } else if (_.includes(validity.disconnectedTiles, t)) {
      t.validity = BoardTileState.Disconnected;
    }
  });

  return newBoard;
}

export function boardWithoutTile(board: Board, tile: BoardTile) {
  let newBoard = Object.assign({}, board);
  newBoard.tiles = _.without(newBoard.tiles, tile);
  return newBoard;
}

export function findWords(board: Board): BoardTile[][] {
  // This can probably be WAY more efficient, but I bet it also doesn't matter.
  // N will always be small (until we make InifiniScrabble!)

  const tileArray = _.keyBy(board.tiles, tile => `${tile.y},${tile.x}`);
  let words: BoardTile[][] = [];

  const nextRightTile = (tile: BoardTile): BoardTile | null => {
    return tileArray[`${tile.y},${tile.x + 1}`];
  };

  const nextBelowTile = (tile: BoardTile): BoardTile | null => {
    return tileArray[`${tile.y + 1},${tile.x}`];
  };

  for (var y = 0; y < board.size; y++) {
    for (var x = 0; x < board.size; x++) {
      const tile = tileArray[`${y},${x}`];
      if (!tile) {
        continue;
      }

      const leftTile = tileArray[`${y},${x - 1}`],
        rightTile = tileArray[`${y},${x + 1}`],
        aboveTile = tileArray[`${y - 1},${x}`],
        belowTile = tileArray[`${y + 1},${x}`];

      if (rightTile && !leftTile) {
        let word: BoardTile[] = [tile];

        let currentTile: BoardTile | null = rightTile;
        while (currentTile) {
          word.push(currentTile);
          currentTile = nextRightTile(currentTile);
        }

        words.push(word);
      }

      if (belowTile && !aboveTile) {
        let word: BoardTile[] = [tile];

        let currentTile: BoardTile | null = belowTile;
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
  const word = _(tiles)
    .chain()
    .map(tile => tile.letter)
    .value()
    .join('');

  return _.includes(Dictionary, word.toLowerCase());
}

export interface BoardValidity {
  isValid: boolean;
  validTiles: BoardTile[];
  invalidTiles: BoardTile[];
  disconnectedTiles: BoardTile[];
}

export function checkBoard(board: Board): BoardValidity {
  const words = findWords(board);
  let wordTiles = _.chain(words)
    .flatten()
    .uniq()
    .value();

  let disconnectedTiles = _.difference(board.tiles, wordTiles);

  let isValid = true;
  let validTiles: BoardTile[] = [];
  let invalidTiles: BoardTile[] = [];

  words.forEach(word => {
    const result = checkWord(word);

    if (result) {
      validTiles = validTiles.concat(word);
    } else {
      invalidTiles = invalidTiles.concat(word);
    }

    isValid = isValid && result;
  });

  invalidTiles = _.uniq(invalidTiles);

  validTiles = _.uniq(validTiles);
  validTiles = _.difference(validTiles, invalidTiles);

  return { validTiles, invalidTiles, disconnectedTiles, isValid };
}
