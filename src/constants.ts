import { State } from './state'
import { BoardTile } from './Tile'

export type Dispatch = (action: Action) => void

export enum DragTypes {
  Tile = 'tile',
  BoardTile = 'board-tile',
}

export interface DragBoardTile {
  x: number
  y: number
  letter: string
  value: number
}

export interface DragTile {
  index: number
  letter: string
  value: number
}

export enum ActionID {
  DRAW_TILES = 'DRAW_TILES',
  OVERWRITE_STATE = 'OVERWRITE_STATE',
  CREATE_NEW_RACK = 'CREATE_NEW_RACK',
  GENERATE_BOARD = 'GENERATE_BOARD',
  PLAY_TILE = 'PLAY_TILE',
  SWAP_WITH_BOARD_TILE = 'SWAP_WITH_BOARD_TILE',
  SWAP_RACK_TILES = 'SWAP_RACK_TILES',
  MOVE_BOARD_TILE = 'MOVE_BOARD_TILE',
  PORTAL_SELECT = 'PORTAL_SELECT',
}

// TODO
// tslint:disable-next-line:no-namespace
export namespace Action {
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
    value: {
      tileIndex: number
      player: string
      position: { x: number; y: number }
    }
  }

  export interface SwapWithBoardTile {
    type: ActionID.SWAP_WITH_BOARD_TILE
    value: { tileIndex: number; player: string; boardTile: BoardTile }
  }

  export interface SwapRackTiles {
    type: ActionID.SWAP_RACK_TILES
    value: { player: string; tileIndex1: number; tileIndex2: number }
  }

  export interface MoveBoardTile {
    type: ActionID.MOVE_BOARD_TILE
    value: { from: { x: number; y: number }; to: { x: number; y: number } }
  }

  export interface PortalSelect {
    type: ActionID.PORTAL_SELECT
    value: { x: number; y: number }
  }
}

export type Action =
  | Action.DrawTiles
  | Action.OverwriteState
  | Action.CreateNewRack
  | Action.GenerateBoard
  | Action.PlayTile
  | Action.SwapWithBoardTile
  | Action.SwapRackTiles
  | Action.MoveBoardTile
  | Action.PortalSelect
