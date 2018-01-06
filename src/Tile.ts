export interface Tile {
  letter: string;
  value: number;
}

export interface BoardTile extends Tile {
  x: number;
  y: number;
}