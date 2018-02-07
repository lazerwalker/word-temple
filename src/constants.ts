import { State } from './state'

export type Dispatch = (action: Action) => void

export enum ActionID {
  SELECT_RACK_TILE = 'SELECT_RACK_TILE',
  DESELECT_RACK_TILE = 'DESELECT_RACK_TILE',
  PLACE_TILE = 'PLACE_TILE',
  DRAW_TILES = 'DRAW_TILES',
  SWAP_TILE_POSITION = 'SWAP_TILE_POSITION',
  SWAP_BOARD_TILE = 'SWAP_BOARD_TILE',
  OVERWRITE_STATE = 'OVERWRITE_STATE',
  CREATE_NEW_RACK = 'CREATE_NEW_RACK',
}

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
