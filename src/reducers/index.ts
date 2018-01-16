import { Action, ActionID } from '../constants';
import { State, Rack } from '../state';
import { Board } from '../Board';

import { boardByAddingTile, boardWithoutTile } from '../Board';

let rack: Rack;
let pos: number;
let board: Board;

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
        board = boardByAddingTile(state.board, state.rack.selectedTile, action.value);

        rack = Object.assign({}, state.rack);

        pos = rack.tiles.indexOf(state.rack.selectedTile);
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
    case ActionID.SWAP_BOARD_TILE:
      if (!state.rack.selectedTile) { return state; }

      const boardTile = state.board.tiles.find((tile) => {
        return (tile.x === action.value.x && tile.y === action.value.y);
      });
      if (!boardTile) { return state; }

      rack = Object.assign({}, state.rack);
      pos = rack.tiles.indexOf(rack.selectedTile!);

      rack.tiles = rack.tiles.slice(0);
      rack.tiles[pos] = boardTile;
      delete rack.selectedTile;

      board = boardWithoutTile(state.board, boardTile);
      board = boardByAddingTile(board, state.rack.selectedTile, action.value);

      return Object.assign({}, state, {rack, board});
    default:
      return state;
  }
};