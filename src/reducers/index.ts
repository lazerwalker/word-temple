import { Action, Actions } from '../constants';
import { State } from '../types';

export default (state: State, action: Action) => {
  console.log("IN REDUCER", action, Actions.SELECT_RACK_TILE);
  switch (action.type) {
    case Actions.SELECT_RACK_TILE:
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