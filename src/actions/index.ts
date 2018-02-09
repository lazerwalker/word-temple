import { Action, ActionID } from '../constants'
import State from '../state'
import { BoardTile, Tile } from '../Tile'

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
  tile: Tile,
  x: number,
  y: number,
  player: string
): Action.PlayTile => {
  return {
    type: ActionID.PLAY_TILE,
    value: {
      player,
      position: { x, y },
      tile,
    },
  }
}

export const swapWithBoardTile = (
  tile: Tile,
  boardTile: BoardTile,
  player: string
): Action.SwapWithBoardTile => {
  return {
    type: ActionID.SWAP_WITH_BOARD_TILE,
    value: { tile, boardTile, player },
  }
}

export const swapRackTiles = (
  tile1: Tile,
  tile2: Tile,
  player: string
): Action.SwapRackTiles => {
  return {
    type: ActionID.SWAP_RACK_TILES,
    value: { player, tile1: tile1.id, tile2: tile2.id },
  }
}
