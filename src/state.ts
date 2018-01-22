import { Tile } from './Tile';
import { Board } from './Board';
import TileBag from './TileBag';

export type RackList = {[player: string]: Rack};

export interface Rack {
  tiles: (Tile|null)[];
  selectedTile?: Tile;
}

export interface State {
  racks: RackList;
  board: Board;
  bag: TileBag;
}

export default State;