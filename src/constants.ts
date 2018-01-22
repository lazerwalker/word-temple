import { Tile } from './Tile';
import { State } from './state';

export enum ActionID {
  SELECT_RACK_TILE = "SELECT_RACK_TILE",
  DESELECT_RACK_TILE = "DESELECT_RACK_TILE",
  PLACE_TILE = "PLACE_TILE",
  DRAW_TILES = "DRAW_TILES",
  SWAP_TILE_POSITION = "SWAP_TILE_POSITION",
  SWAP_BOARD_TILE = "SWAP_BOARD_TILE",
  OVERWRITE_STATE = "OVERWRITE_STATE"
}

export namespace Action {
  export interface SelectRackTile {
    type: ActionID.SELECT_RACK_TILE;
    value: Tile;
  }

  export interface DeselectRackTile {
    type: ActionID.DESELECT_RACK_TILE;
  }

  export interface PlaceTile {
    type: ActionID.PLACE_TILE;
    value: {x: number, y: number};
  }

  export interface DrawTiles {
    type: ActionID.DRAW_TILES;
    value: number;
  }

  export interface SwapTilePosition {
    type: ActionID.SWAP_TILE_POSITION;
    value: Tile;
  }

  export interface SwapBoardTile {
    type: ActionID.SWAP_BOARD_TILE;
    value: {x: number, y: number};
  }

  export interface OverwriteState {
    type: ActionID.OVERWRITE_STATE;
    value: State;
  }
}

export type Action =  Action.SelectRackTile |
                      Action.DeselectRackTile |
                      Action.PlaceTile |
                      Action.DrawTiles |
                      Action.SwapTilePosition |
                      Action.SwapBoardTile |
                      Action.OverwriteState;