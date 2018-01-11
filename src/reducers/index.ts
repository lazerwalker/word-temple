import * as _ from 'lodash';

import { Action, ActionID } from '../constants';
import State from '../state';

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

        var rack = Object.assign({}, state.rack);
        rack.tiles = _.without(rack.tiles, rack.selectedTile!);
        delete rack.selectedTile;

        return Object.assign({}, state, {board, rack});
      }
      return state;
    case ActionID.DRAW_TILES:
      const [tiles, newBag] = state.bag.sampleN(action.value);

      let newTiles = state.rack.tiles.concat(tiles);
      var theRack = Object.assign({}, state.rack, {tiles: newTiles});

      return Object.assign({}, state, {rack: theRack, bag: newBag});
    default:
      return state;
  }
};