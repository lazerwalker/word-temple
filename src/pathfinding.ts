import { Board } from './Board'
import { BoardTile, BoardTileState } from './Tile'

import * as _ from 'lodash'

interface Pos {
  x: number
  y: number
}

export function hasCompletePath(board: Board): boolean {
  for (const exit of board.exits) {
    if (checkPath(board.entrance, exit)) {
      return true
    }
  }

  return false

  function checkPath(start: Pos, end: Pos): boolean {
    const visited: boolean[][] = []

    return visitNode(start.x, start.y)

    function visitNode(x: number, y: number): boolean {
      if (visited[y] && visited[y][x]) {
        return false
      }

      const tile = findTile(x, y)
      if (!(tile && tile.validity === BoardTileState.Valid)) {
        return false
      }

      if (x === end.x && y === end.y) {
        return true
      }

      if (!visited[y]) {
        visited[y] = []
      }
      visited[y][x] = true

      return (
        visitNode(x + 1, y) ||
        visitNode(x - 1, y) ||
        visitNode(x, y + 1) ||
        visitNode(x, y - 1)
      )
    }
  }

  function findTile(x: number, y: number): BoardTile | undefined {
    if (x < 0 || x >= board.size || y < 0 || y >= board.size) {
      return undefined
    }
    return _.find(board.tiles, tile => tile.x === x && tile.y === y)
  }
}
