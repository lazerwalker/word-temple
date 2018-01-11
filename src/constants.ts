import { Tile } from './Tile';

export enum ActionID {
  SELECT_RACK_TILE = "SELECT_RACK_TILE",
  DESELECT_RACK_TILE = "DESELECT_RACK_TILE",
  PLACE_TILE = "PLACE_TILE",
  DRAW_TILES = "DRAW_TILES"
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
}

export type Action = Action.SelectRackTile | Action.DeselectRackTile | Action.PlaceTile | Action.DrawTiles;