import { Board, Portal, Side } from './Board'
import { BoardTile, BoardTileState } from './Tile'

import * as _ from 'lodash'

interface Pos {
  x: number
  y: number
}

export function hasCompletePath(board: Board): boolean {
  if (!board.entrance) {
    return false
  }
  if (!board.exit) {
    return false
  }

  const input = tileFromPortal(board.entrance, board)
  const goal = tileFromPortal(board.exit, board)

  const visited: boolean[][] = []

  function visitNode(x: number, y: number): boolean {
    if (visited[y] && visited[y][x]) {
      return false
    }

    const tile = findTile(x, y)
    if (!(tile && tile.validity === BoardTileState.Valid)) {
      return false
    }

    if (x === goal.x && y === goal.y) {
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

  function findTile(x: number, y: number): BoardTile | undefined {
    if (x < 0 || x >= board.size || y < 0 || y >= board.size) {
      return undefined
    }
    return _.find(board.tiles, tile => tile.x === x && tile.y === y)
  }

  return visitNode(input.x, input.y)
}

function tileFromPortal(portal: Portal, board: Board): Pos {
  switch (portal.side) {
    case Side.Left:
      return { x: 0, y: portal.position }
    case Side.Right:
      return { x: board.size - 1, y: portal.position }
    case Side.Top:
      return { x: portal.position, y: 0 }
    case Side.Bottom:
    default:
      return { x: portal.position, y: board.size - 1 }
  }
}
