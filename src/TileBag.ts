import * as _ from 'lodash'

import { Tile } from './Tile'

interface TileData {
  tile: string
  count: number
  value: number
}

const tileData = [
  { tile: 'A', count: 9, value: 1 },
  { tile: 'B', count: 2, value: 4 },
  { tile: 'C', count: 2, value: 4 },
  { tile: 'D', count: 5, value: 2 },
  { tile: 'E', count: 13, value: 1 },
  { tile: 'F', count: 2, value: 4 },
  { tile: 'G', count: 3, value: 3 },
  { tile: 'H', count: 4, value: 3 },
  { tile: 'I', count: 8, value: 1 },
  { tile: 'J', count: 1, value: 10 },
  { tile: 'K', count: 1, value: 5 },
  { tile: 'L', count: 4, value: 2 },
  { tile: 'M', count: 2, value: 4 },
  { tile: 'N', count: 5, value: 2 },
  { tile: 'O', count: 8, value: 1 },
  { tile: 'P', count: 2, value: 4 },
  { tile: 'Q', count: 1, value: 10 },
  { tile: 'R', count: 6, value: 1 },
  { tile: 'S', count: 5, value: 1 },
  { tile: 'T', count: 7, value: 1 },
  { tile: 'U', count: 4, value: 2 },
  { tile: 'V', count: 2, value: 5 },
  { tile: 'W', count: 2, value: 4 },
  { tile: 'X', count: 1, value: 8 },
  { tile: 'Y', count: 2, value: 3 },
  { tile: 'Z', count: 1, value: 10 },
]

const allTiles = _(tileData)
  .map((tile: TileData) => {
    return _.range(tile.count).map(i => {
      return {
        id: `${tile.tile}${i}`,
        letter: tile.tile,
        value: tile.value,
      }
    })
  })
  .flatten()
  .value()

export default class TileBag {
  public tiles: Tile[]

  constructor(tiles?: Tile[]) {
    this.tiles = tiles || [...allTiles]
  }
}

export function sampleN(bag: TileBag, n: number): [Tile[], TileBag] {
  const tiles = _.sampleSize(bag.tiles, n)
  if (tiles) {
    const newTiles = _.difference(bag.tiles, tiles)
    return [tiles, new TileBag(newTiles)]
  }
  return [[], bag]
}

export function drawHand(bag: TileBag): [Tile[], TileBag] {
  return sampleN(bag, 7)
}

export function pick(bag: TileBag): [Tile | undefined, TileBag] {
  const result = sampleN(bag, 1)
  if (result[0].length === 0) {
    return [undefined, result[1]]
  } else {
    return [result[0][1], result[1]]
  }
}

export function sampleAbstractTile(): Tile {
  return _.sample(allTiles)!
}
