import { Tile } from './Tile';
import { Board } from './Board';
import TileBag from './TileBag';

export default interface State {
  rack: {
    tiles: (Tile|null)[];
    selectedTile?: Tile;
  };

  board: Board;

  bag: TileBag;
}