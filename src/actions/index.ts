import { Tile } from '../Tile';
import { ActionID, Action } from '../constants';

export const selectRackTile = (tile: Tile): Action.SelectRackTile => {
  return {
    type: ActionID.SELECT_RACK_TILE,
    value: tile
  };
};

export const deselectRackTile = (): Action.DeselectRackTile => {
  return {
    type: ActionID.DESELECT_RACK_TILE,
  };
};