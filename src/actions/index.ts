import { Tile } from '../Tile';
import { ActionID, Action } from '../constants';
import State from '../state';

export const chooseRackTile = (player: string, tile: Tile) => {
  return (dispatch: any, getState: (() => State)) => {
    const state = getState();
    if (state.racks[player].selectedTile) {
      dispatch(swapTilePosition(player, tile));
    } else {
      dispatch(selectRackTile(player, tile));
    }

  };
};

const selectRackTile = (player: string, tile: Tile) => {
  return {
    type: ActionID.SELECT_RACK_TILE,
    value: { tile, player }
  };
};

const swapTilePosition = (player: string, tile: Tile) => {
  return {
    type: ActionID.SWAP_TILE_POSITION,
    value: { tile, player }
  };
};

export const deselectRackTile = (player: string): Action.DeselectRackTile => {
  return {
    type: ActionID.DESELECT_RACK_TILE,
    value: player
  };
};

export const placeTile = (player: string, x: number, y: number) => {
  return {
    type: ActionID.PLACE_TILE,
    value: { x, y, player }
  };
};

export const drawTiles = (player: string, count: number = 1): Action.DrawTiles => {
  return {
    type: ActionID.DRAW_TILES,
    value: { count, player }
  };
};

export const swapBoardTile = (player: string, x: number, y: number): Action.SwapBoardTile => {
  return {
    type: ActionID.SWAP_BOARD_TILE,
    value: { x, y, player }
  };
};

export const overwriteState = (state: State): Action.OverwriteState => {
  console.log(state);
  return {
    type: ActionID.OVERWRITE_STATE,
    value: state
  };
};

export const createNewRack = (client: string): Action.CreateNewRack => {
  return {
    type: ActionID.CREATE_NEW_RACK,
    value: client
  };
};