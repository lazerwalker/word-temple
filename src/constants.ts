import { State } from './state'
import { BoardTile, Tile } from './Tile'

export type Dispatch = (action: Action) => void

export enum DragTypes {
  Tile = 'tile',
}

export enum ActionID {
  SELECT_RACK_TILE = 'SELECT_RACK_TILE',
  DESELECT_RACK_TILE = 'DESELECT_RACK_TILE',
  PLACE_TILE = 'PLACE_TILE',
  DRAW_TILES = 'DRAW_TILES',
  SWAP_TILE_POSITION = 'SWAP_TILE_POSITION',
  SWAP_BOARD_TILE = 'SWAP_BOARD_TILE',
  OVERWRITE_STATE = 'OVERWRITE_STATE',
  CREATE_NEW_RACK = 'CREATE_NEW_RACK',
  GENERATE_BOARD = 'GENERATE_BOARD',
  PLACE_TILE_BY_DRAG = 'PLACE_TILE_BY_DRAG',
  SWAP_TILE_BY_DRAG = 'SWAP_TILE_BY_DRAG',
  SWAP_RACK_TILES = 'SWAP_RACK_TILES',
}

// TODO
// tslint:disable-next-line:no-namespace
export namespace Action {
  export interface SelectRackTile {
    type: ActionID.SELECT_RACK_TILE
    value: { tile: string; player: string }
  }

  export interface DeselectRackTile {
    type: ActionID.DESELECT_RACK_TILE
    value: string
  }

  export interface PlaceTile {
    type: ActionID.PLACE_TILE
    value: { x: number; y: number; player: string }
  }

  export interface DrawTiles {
    type: ActionID.DRAW_TILES
    value: { count: number; player: string }
  }

  export interface SwapTilePosition {
    type: ActionID.SWAP_TILE_POSITION
    value: { tile: string; player: string }
  }

  export interface SwapBoardTile {
    type: ActionID.SWAP_BOARD_TILE
    value: { x: number; y: number; player: string }
  }

  export interface OverwriteState {
    type: ActionID.OVERWRITE_STATE
    value: State
  }

  export interface CreateNewRack {
    type: ActionID.CREATE_NEW_RACK
    value: string
  }

  export interface GenerateBoard {
    type: ActionID.GENERATE_BOARD
    value: number
  }

  export interface PlaceTileByDrag {
    type: ActionID.PLACE_TILE_BY_DRAG
    value: { tile: Tile; player: string; position: { x: number; y: number } }
  }

  export interface SwapTileByDrag {
    type: ActionID.SWAP_TILE_BY_DRAG
    value: { tile: Tile; player: string; boardTile: BoardTile }
  }

  export interface SwapRackTiles {
    type: ActionID.SWAP_RACK_TILES
    value: { player: string; tile1: string; tile2: string }
  }
}

export type Action =
  | Action.SelectRackTile
  | Action.DeselectRackTile
  | Action.PlaceTile
  | Action.DrawTiles
  | Action.SwapTilePosition
  | Action.SwapBoardTile
  | Action.OverwriteState
  | Action.CreateNewRack
  | Action.GenerateBoard
  | Action.PlaceTileByDrag
  | Action.SwapTileByDrag
  | Action.SwapRackTiles
