export interface Tile {
  letter: string
  value: number
  id: string
}

export enum BoardTileState {
  Valid = 'valid',
  Invalid = 'invalid',
  Disconnected = 'disconnected',
}

export interface BoardTile extends Tile {
  x: number
  y: number
  validity?: BoardTileState
  movable: boolean
}
