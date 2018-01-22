import { Action, ActionID } from '../constants';
import { State, Rack, RackList } from '../state';
import { Board } from '../Board';
import { Tile } from '../Tile';

import { sampleN } from '../TileBag';

import { boardByAddingTile, boardWithoutTile } from '../Board';

let rack: Rack;
let racks: RackList;
let pos: number;
let board: Board;
let tiles;
let newBag;
let player: string;
let tile: Tile;

export default (state: State, action: Action) => {
  if (!(window as any).isHost && (window as any).network && action.type !== ActionID.OVERWRITE_STATE) {
    console.log("Not the host!");
    (window as any).network.dispatch(action);
  }

  switch (action.type) {
    case ActionID.OVERWRITE_STATE:
      if ((window as any).isHost) { return; }
      // TODO: Be smart about multiple tile racks
      return Object.assign({}, state, action.value);
    case ActionID.SELECT_RACK_TILE:
      player = action.value.player;
      tile = action.value.tile;

      racks = Object.assign({}, state.racks);
      racks[player] = Object.assign({}, racks[player], {selectedTile: tile});

      return Object.assign({}, state, {racks});
    case ActionID.DESELECT_RACK_TILE:
      player = action.value;

      racks = Object.assign({}, state.racks);

      rack = Object.assign({}, racks[player]);
      delete rack.selectedTile;
      racks[player] = rack;

      return Object.assign({}, state, {racks});
    case ActionID.PLACE_TILE:
      player = action.value.player;
      if (state.racks[player].selectedTile) {
        board = boardByAddingTile(state.board, state.racks[player].selectedTile!, action.value);

        racks = Object.assign({}, state.racks);
        rack = Object.assign({}, racks[player]);

        pos = rack.tiles.indexOf(rack.selectedTile!);
        rack.tiles[pos] = null;
        delete rack.selectedTile;

        racks[player] = rack;
        return Object.assign({}, state, {board, racks});
      }
      return state;
    case ActionID.CREATE_NEW_RACK:
      console.log("Creating new rack");
      [tiles, newBag] = sampleN(state.bag, 7);
      rack = {tiles};

      racks = Object.assign({}, state.racks);
      racks[action.value] = rack;
      return Object.assign({}, state, {racks, bag: newBag});
    case ActionID.DRAW_TILES:
      player = action.value.player;
      const count = action.value.count;
      [tiles, newBag] = sampleN(state.bag, count);

      racks = Object.assign({}, state.racks);
      rack = Object.assign({}, racks[player]);

      tiles.forEach((t) => {
        const nullPos = rack.tiles.indexOf(null);
        if (nullPos !== -1) {
          rack.tiles[nullPos] = t;
        } else {
          rack.tiles.push(t);
        }
      });

      racks[player] = rack;
      return Object.assign({}, state, {racks, bag: newBag});
    case ActionID.SWAP_TILE_POSITION:
      player = action.value.player;
      tile = action.value.tile;

      if (!state.racks[player].selectedTile) { return state; }

      racks = Object.assign({}, state.racks);
      rack = Object.assign({}, racks[player]);

      const pos1 = rack.tiles.indexOf(rack.selectedTile!);
      const pos2 = rack.tiles.indexOf(tile);

      rack.tiles[pos2] = rack.selectedTile!;
      rack.tiles[pos1] = tile;
      delete rack.selectedTile;

      racks[player] = rack;
      return Object.assign({}, state, {racks});
    case ActionID.SWAP_BOARD_TILE:
      player = action.value.player;
      let {x, y} = action.value;

      if (!state.racks[player].selectedTile) { return state; }

      const boardTile = state.board.tiles.find((t) => {
        return (t.x === x && t.y === y);
      });
      if (!boardTile) { return state; }

      racks = Object.assign({}, state.racks);
      rack = Object.assign({}, racks[player]);
      pos = rack.tiles.indexOf(rack.selectedTile!);

      let previouslySelectedTile = rack.selectedTile!;

      rack.tiles = rack.tiles.slice(0);
      rack.tiles[pos] = boardTile;
      delete rack.selectedTile;
      racks[player] = rack;

      board = boardWithoutTile(state.board, boardTile);
      board = boardByAddingTile(board, previouslySelectedTile, action.value);

      return Object.assign({}, state, {rack, board});
    default:
      return state;
  }
};