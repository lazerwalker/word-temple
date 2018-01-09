import { Tile } from '../Tile';
import { Actions, ActionSelectRackTile } from '../constants';

export const selectRackTile = (tile: Tile): ActionSelectRackTile => {
  return {
    type: Actions.SELECT_RACK_TILE,
    value: tile
  };
};