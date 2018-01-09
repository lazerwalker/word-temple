import { Action, ActionID } from '../constants';
import { State } from '../types';

export default (state: State, action: Action) => {
  switch (action.type) {
    case ActionID.SELECT_RACK_TILE:
      return Object.assign({}, state, {rack: {
        tiles: state.rack.tiles,
        selectedTile: action.value}
      });
    case ActionID.DESELECT_RACK_TILE:
      return Object.assign({}, state, {rack: {
        tiles: state.rack.tiles,
        selectedTile: undefined}
      });
    default:
      return state;
  }
};