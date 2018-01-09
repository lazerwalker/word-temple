import { Tile } from './Tile';

export enum Actions {
  SELECT_RACK_TILE = "SELECT_RACK_TILE"
}

export interface ActionSelectRackTile {
  type: Actions.SELECT_RACK_TILE;
  value: Tile;
}

export type Action = ActionSelectRackTile;