import { State } from './state'
import { BoardTile, Tile } from './Tile'

export type Dispatch = (action: Action) => void

export enum DragTypes {
  Tile = 'tile',
}

export enum ActionID {
  SELECT_RACK_TILE = 'SELECT_RACK_TILE',
  DESELECT_RACK_TILE = 'DESELECT_RACK_TILE',
  DRAW_TILES = 'DRAW_TILES',
  OVERWRITE_STATE = 'OVERWRITE_STATE',
  CREATE_NEW_RACK = 'CREATE_NEW_RACK',
  GENERATE_BOARD = 'GENERATE_BOARD',
  PLAY_TILE = 'PLAY_TILE',
  SWAP_WITH_BOARD_TILE = 'SWAP_WITH_BOARD_TILE',
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

  export interface DrawTiles {
    type: ActionID.DRAW_TILES
    value: { count: number; player: string }
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

  export interface PlayTile {
    type: ActionID.PLAY_TILE
    value: { tile: Tile; player: string; position: { x: number; y: number } }
  }

  export interface SwapWithBoardTile {
    type: ActionID.SWAP_WITH_BOARD_TILE
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
  | Action.DrawTiles
  | Action.OverwriteState
  | Action.CreateNewRack
  | Action.GenerateBoard
  | Action.PlayTile
  | Action.SwapWithBoardTile
  | Action.SwapRackTiles
