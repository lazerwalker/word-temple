import * as _ from 'lodash'

import { hasCompletePath } from './pathfinding'
import { BoardTile, BoardTileState, Tile } from './Tile'
import { sampleAbstractTile } from './TileBag'
// tslint:disable-next-line:no-var-requires
// const Dictionary: string[] = require('./dictionary')

// tslint:disable-next-line:no-submodule-imports no-var-requires
const Animals: string[] = require('corpora/data/animals/common').animals

export interface Board {
  tiles: BoardTile[]
  size: number
  entrance?: Portal
  exit?: Portal
  exitIsComplete?: boolean // TODO: Wrap into exit?
}

export interface Portal {
  side: Side
  position: number
}

export enum Side {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom',
}

export function generateNewBoard(size: number = 7, entrance?: Portal) {
  let availableSides: string[] = _.shuffle(Object.keys(Side))

  // TODO: This is a hack to stop it so that we don't end up with an
  // entrance/exit in the same tile (if they're at a corner).
  // We should properly be detecting that specific condition, but this is easier
  let availablePositions: number[] = Array.from(Array(size).keys())

  if (entrance) {
    availablePositions = _.without(availablePositions, entrance.position)
    availableSides = _.without(
      availableSides,
      _.findKey(Side, s => s === entrance!.side)!
    )
  } else {
    entrance = {
      position: availablePositions.pop()!,
      side: Side[availableSides.pop()!],
    }
  }

  const exit = {
    position: availablePositions.pop()!,
    side: Side[availableSides.pop()!],
  }

  const tiles: BoardTile[] = []

  if (_.random(1) === 0) {
    tiles.push({
      ...sampleAbstractTile(),
      movable: false,
      x: _.random(size - 1),
      y: _.random(size - 1),
    })
  }

  return {
    entrance,
    exit,
    exitIsComplete: false,
    size,
    tiles,
  }
}

export function boardTileAtPosition(
  board: Board,
  x: number,
  y: number
): BoardTile | undefined {
  return _.find(board.tiles, { x, y })
}

export function boardByAddingBoardTile(board: Board, tile: BoardTile): Board {
  const newBoard = { ...board }
  if (!newBoard.tiles) {
    newBoard.tiles = []
  }
  newBoard.tiles = newBoard.tiles.slice(0)
  newBoard.tiles.push(tile)

  const validity = checkBoard(newBoard)

  newBoard.tiles.forEach(t => {
    if (_.includes(validity.validTiles, t)) {
      t.validity = BoardTileState.Valid
    } else if (_.includes(validity.invalidTiles, t)) {
      t.validity = BoardTileState.Invalid
    } else if (_.includes(validity.disconnectedTiles, t)) {
      t.validity = BoardTileState.Disconnected
    }
  })

  newBoard.exitIsComplete = hasCompletePath(newBoard)

  return newBoard
}

export function boardByAddingTile(
  board: Board,
  tile: Tile,
  position: { x: number; y: number }
) {
  const newTile = { ...tile, ...position, movable: true }
  return boardByAddingBoardTile(board, newTile)
}

export function boardWithoutTile(board: Board, tile: BoardTile) {
  const newBoard = { ...board }
  newBoard.tiles = _.reject(newBoard.tiles, t => t.id === tile.id)
  return newBoard
}

export function findWords(board: Board): BoardTile[][] {
  // This can probably be WAY more efficient, but I bet it also doesn't matter.
  // N will always be small (until we make InifiniScrabble!)

  const tileArray = _.keyBy(board.tiles, tile => `${tile.y},${tile.x}`)
  const words: BoardTile[][] = []

  const nextRightTile = (tile: BoardTile): BoardTile | null => {
    return tileArray[`${tile.y},${tile.x + 1}`]
  }

  const nextBelowTile = (tile: BoardTile): BoardTile | null => {
    return tileArray[`${tile.y + 1},${tile.x}`]
  }

  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const tile = tileArray[`${y},${x}`]
      if (!tile) {
        continue
      }

      const leftTile = tileArray[`${y},${x - 1}`]
      const rightTile = tileArray[`${y},${x + 1}`]
      const aboveTile = tileArray[`${y - 1},${x}`]
      const belowTile = tileArray[`${y + 1},${x}`]

      if (rightTile && !leftTile) {
        const word: BoardTile[] = [tile]

        let currentTile: BoardTile | null = rightTile
        while (currentTile) {
          word.push(currentTile)
          currentTile = nextRightTile(currentTile)
        }

        words.push(word)
      }

      if (belowTile && !aboveTile) {
        const word: BoardTile[] = [tile]

        let currentTile: BoardTile | null = belowTile
        while (currentTile) {
          word.push(currentTile)
          currentTile = nextBelowTile(currentTile)
        }

        words.push(word)
      }
    }
  }

  return words
}

export function checkWord(tiles: BoardTile[]): boolean {
  const word = _(tiles)
    .chain()
    .map(tile => tile.letter)
    .value()
    .join('')
    .toLowerCase()

  return _.includes(Animals, word)
}

export interface BoardValidity {
  isValid: boolean
  validTiles: BoardTile[]
  invalidTiles: BoardTile[]
  disconnectedTiles: BoardTile[]
}

export function checkBoard(board: Board): BoardValidity {
  const words = findWords(board)
  const wordTiles = _.chain(words)
    .flatten()
    .uniq()
    .value()

  const disconnectedTiles = _.difference(board.tiles, wordTiles)

  let isValid = true
  let validTiles: BoardTile[] = []
  let invalidTiles: BoardTile[] = []

  words.forEach(word => {
    const result = checkWord(word)

    if (result) {
      validTiles = validTiles.concat(word)
    } else {
      invalidTiles = invalidTiles.concat(word)
    }

    isValid = isValid && result
  })

  invalidTiles = _.uniq(invalidTiles)

  validTiles = _.uniq(validTiles)
  validTiles = _.difference(validTiles, invalidTiles)

  return { validTiles, invalidTiles, disconnectedTiles, isValid }
}
