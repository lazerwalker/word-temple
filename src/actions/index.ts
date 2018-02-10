import { Action, ActionID } from '../constants'
import State from '../state'
import { BoardTile } from '../Tile'

export const drawTiles = (
  player: string,
  count: number = 1
): Action.DrawTiles => {
  return {
    type: ActionID.DRAW_TILES,
    value: { count, player },
  }
}

export const overwriteState = (state: State): Action.OverwriteState => {
  return {
    type: ActionID.OVERWRITE_STATE,
    value: state,
  }
}

export const createNewRack = (client: string): Action.CreateNewRack => {
  return {
    type: ActionID.CREATE_NEW_RACK,
    value: client,
  }
}

export const generateBoard = (size: number = 7): Action.GenerateBoard => {
  return {
    type: ActionID.GENERATE_BOARD,
    value: size,
  }
}

export const playTile = (
  tileIndex: number,
  x: number,
  y: number,
  player: string
): Action.PlayTile => {
  return {
    type: ActionID.PLAY_TILE,
    value: {
      player,
      position: { x, y },
      tileIndex,
    },
  }
}

export const swapWithBoardTile = (
  tileIndex: number,
  boardTile: BoardTile,
  player: string
): Action.SwapWithBoardTile => {
  return {
    type: ActionID.SWAP_WITH_BOARD_TILE,
    value: { tileIndex, boardTile, player },
  }
}

export const swapRackTiles = (
  tileIndex1: number,
  tileIndex2: number,
  player: string
): Action.SwapRackTiles => {
  return {
    type: ActionID.SWAP_RACK_TILES,
    value: { player, tileIndex1, tileIndex2 },
  }
}
