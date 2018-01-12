import { Action, ActionID } from '../constants';
import State from '../state';

let rack: any;

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

        rack = Object.assign({}, state.rack);

        const pos = rack.tiles.indexOf(state.rack.selectedTile);
        rack.tiles[pos] = null;
        delete rack.selectedTile;

        return Object.assign({}, state, {board, rack});
      }
      return state;
    case ActionID.DRAW_TILES:
      const [tiles, newBag] = state.bag.sampleN(action.value);
      rack = Object.assign({}, state.rack);

      tiles.forEach((tile) => {
        const nullPos = state.rack.tiles.indexOf(null);
        if (nullPos !== -1) {
          rack.tiles[nullPos] = tile;
        } else {
          rack.tiles.push(tile);
        }
      });

      return Object.assign({}, state, {rack, bag: newBag});
    case ActionID.SWAP_TILE_POSITION:
      rack = Object.assign({}, state.rack);
      if (!rack.selectedTile) { return state; }

      const pos1 = rack.tiles.indexOf(rack.selectedTile);
      const pos2 = rack.tiles.indexOf(action.value);

      rack.tiles[pos2] = rack.selectedTile;
      rack.tiles[pos1] = action.value;
      delete rack.selectedTile;

      return Object.assign({}, state, {rack});
    default:
      return state;
  }
};