import { Tile } from './Tile';
import { Board } from './Board';
import TileBag from './TileBag';

export interface Rack {
  tiles: (Tile|null)[];
  selectedTile?: Tile;
}

export interface State {
  rack: Rack;
  board: Board;
  bag: TileBag;
}

export default State;