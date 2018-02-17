import { Board } from './Board'
import { Tile } from './Tile'
import TileBag from './TileBag'

export interface RackList {
  [player: string]: Rack
}

export interface Rack {
  tiles: Tile[]
  selectedTileID?: string
}

export interface State {
  racks: RackList
  board: Board
  bag: TileBag
}

export function createState(props?: State) {
  const board = {
    size: 7,
    tiles: [],
  }
  const bag = new TileBag()
  const racks = {}

  return { racks, board, bag, ...props }
}

export default State
