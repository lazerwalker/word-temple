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
    case ActionID.PLACE_TILE:
      if (state.rack.selectedTile) {
        let newTile = Object.assign({}, state.rack.selectedTile, action.value);

        let board = Object.assign({}, state.board);
        board.tiles = board.tiles.slice(0);
        board.tiles.push(newTile);

        let rack = Object.assign({}, state.rack);
        delete rack.selectedTile;

        return Object.assign({}, state, {board, rack});
      }
      return state;
    default:
      return state;
  }
};