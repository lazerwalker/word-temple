import { Action, ActionID } from '../constants';
import { State } from '../types';

export default (state: State, action: Action) => {
  switch (action.type) {
    case ActionID.SELECT_RACK_TILE:
      const newState = Object.assign({}, state, {rack: {
        tiles: state.rack.tiles,
        selectedTile: action.value}
      });
      console.log(newState);
      return newState;
    default:
      return state;
  }
};