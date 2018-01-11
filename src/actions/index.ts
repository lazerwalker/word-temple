import { Tile } from '../Tile';
import { ActionID, Action } from '../constants';
import State from '../state';

export const chooseRackTile = (tile: Tile) => {
  return (dispatch: any, getState: (() => State)) => {
    const state = getState();
    if (state.rack.selectedTile) {
      dispatch(swapTilePosition(tile));
    } else {
      dispatch(selectRackTile(tile));
    }

  };
};

const selectRackTile = (tile: Tile) => {
  console.log("SelectRackTile")
  return {
    type: ActionID.SELECT_RACK_TILE,
    value: tile
  };
};

const swapTilePosition = (tile: Tile) => {
  console.log("SwapTilePosition")
  return {
    type: ActionID.SWAP_TILE_POSITION,
    value: tile
  };
}

export const deselectRackTile = (): Action.DeselectRackTile => {
  return {
    type: ActionID.DESELECT_RACK_TILE,
  };
};

export const placeTile = (x: number, y: number) => {
  return {
    type: ActionID.PLACE_TILE,
    value: {x, y}
  };
};

export const drawTiles = (n: number = 1): Action.DrawTiles => {
  return {
    type: ActionID.DRAW_TILES,
    value: n
  };
};