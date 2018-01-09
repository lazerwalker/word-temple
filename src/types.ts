import { Tile } from './Tile';
import { Board } from './Board';

export interface State {
  rack: {
    tiles: Tile[];
  };

  board: Board;
}