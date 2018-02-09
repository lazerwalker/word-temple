import { Action, ActionID } from '../constants'
import State from '../state'
import { Tile, BoardTile } from '../Tile'

export const chooseRackTile = (player: string, tile: Tile) => {
  return (dispatch: any, getState: (() => State)) => {
    const state = getState()
    if (state.racks[player].selectedTileID) {
      dispatch(swapTilePosition(player, tile))
    } else {
      dispatch(selectRackTile(player, tile))
    }
  }
}

const selectRackTile = (player: string, tile: Tile) => {
  return {
    type: ActionID.SELECT_RACK_TILE,
    value: { tile: tile.id, player },
  }
}

const swapTilePosition = (player: string, tile: Tile) => {
  return {
    type: ActionID.SWAP_TILE_POSITION,
    value: { tile: tile.id, player },
  }
}

export const deselectRackTile = (player: string): Action.DeselectRackTile => {
  return {
    type: ActionID.DESELECT_RACK_TILE,
    value: player,
  }
}

export const placeTile = (player: string, x: number, y: number) => {
  return {
    type: ActionID.PLACE_TILE,
    value: { x, y, player },
  }
}

export const drawTiles = (
  player: string,
  count: number = 1
): Action.DrawTiles => {
  return {
    type: ActionID.DRAW_TILES,
    value: { count, player },
  }
}

export const swapBoardTile = (
  player: string,
  x: number,
  y: number
): Action.SwapBoardTile => {
  return {
    type: ActionID.SWAP_BOARD_TILE,
    value: { x, y, player },
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

export const placeTileByDrag = (
  tile: Tile,
  x: number,
  y: number,
  player: string
): Action.PlaceTileByDrag => {
  return {
    type: ActionID.PLACE_TILE_BY_DRAG,
    value: {
      player,
      position: { x, y },
      tile,
    },
  }
}

export const swapTileByDrag = (
  tile: Tile,
  boardTile: BoardTile,
  player: string
): Action.SwapTileByDrag => {
  return {
    type: ActionID.SWAP_TILE_BY_DRAG,
    value: { tile, boardTile, player },
  }
}
