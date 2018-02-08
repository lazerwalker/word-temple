import * as Board from '../Board'
import { hasCompletePath } from '../pathfinding'
import { BoardTile } from '../Tile'

describe('finding a valid path', () => {
  let board: Board.Board
  let words: BoardTile[][]

  describe('when there is no exit', () => {
    it('should always return false', () => {
      const tiles = [
        { x: 0, y: 1, letter: 'C', value: 3, id: 'C1', movable: true },
        { x: 1, y: 1, letter: 'A', value: 1, id: 'A1', movable: true },
        { x: 2, y: 1, letter: 'T', value: 1, id: 'T1', movable: true },
        { x: 1, y: 2, letter: 'J', value: 1, id: 'J1', movable: true },
        { x: 3, y: 5, letter: 'Z', value: 10, id: 'Z1', movable: true },
      ]

      board = {
        entrance: { side: Board.Side.Left, position: 1 },
        size: 5,
        tiles,
      }
      expect(hasCompletePath(board)).toBeFalsy()
    })
  })

  describe('when there is no entrance', () => {
    it('should always return false', () => {
      const tiles = [
        { x: 0, y: 1, letter: 'C', value: 3, id: 'C1', movable: true },
        { x: 1, y: 1, letter: 'A', value: 1, id: 'A1', movable: true },
        { x: 2, y: 1, letter: 'T', value: 1, id: 'T1', movable: true },
        { x: 1, y: 2, letter: 'J', value: 1, id: 'J1', movable: true },
        { x: 3, y: 5, letter: 'Z', value: 10, id: 'Z1', movable: true },
      ]

      board = { tiles, size: 5, exit: { side: Board.Side.Left, position: 1 } }
      expect(hasCompletePath(board)).toBeFalsy()
    })
  })

  describe('when there is no valid path', () => {
    it('should return false', () => {
      const tiles = [
        { x: 0, y: 1, letter: 'C', value: 3, id: 'C1', movable: true },
        { x: 0, y: 0, letter: 'A', value: 1, id: 'A1', movable: true },
        { x: 2, y: 1, letter: 'T', value: 1, id: 'T1', movable: true },
      ]

      const entrance = {
        position: 1,
        side: Board.Side.Left,
      }

      const exit = {
        position: 1,
        side: Board.Side.Right,
      }
      board = { tiles, size: 3, entrance, exit }
      expect(hasCompletePath(board)).toBeFalsy()
    })
  })

  describe('when there is a valid path of valid words', () => {
    it('should return true', () => {
      const tiles = [
        { x: 0, y: 1, letter: 'T', value: 1, id: 'T1', movable: true },
        { x: 1, y: 1, letter: 'A', value: 1, id: 'A1', movable: true },
        { x: 1, y: 2, letter: 'T', value: 1, id: 'T2', movable: true },
      ]

      const entrance = {
        position: 1,
        side: Board.Side.Left,
      }

      const exit = {
        position: 1,
        side: Board.Side.Bottom,
      }
      board = { tiles: [], size: 3, entrance, exit }
      tiles.forEach(t => (board = Board.boardByAddingBoardTile(board, t)))
      expect(hasCompletePath(board)).toBeTruthy()
    })
  })

  describe('when there is a valid path of invalid words', () => {
    it('should return false', () => {
      const tiles = [
        { x: 0, y: 1, letter: 'C', value: 3, id: 'C1', movable: true },
        { x: 1, y: 1, letter: 'J', value: 1, id: 'A1', movable: true },
        { x: 1, y: 0, letter: 'T', value: 1, id: 'T1', movable: true },
      ]

      const entrance = {
        position: 1,
        side: Board.Side.Left,
      }

      const exit = {
        position: 1,
        side: Board.Side.Top,
      }
      board = { tiles: [], size: 3, entrance, exit }
      tiles.forEach(t => (board = Board.boardByAddingBoardTile(board, t)))
      expect(hasCompletePath(board)).toBeFalsy()
    })
  })

  beforeEach(() => {
    const tiles = [
      { x: 0, y: 1, letter: 'C', value: 3, id: 'C1', movable: true },
      { x: 1, y: 1, letter: 'A', value: 1, id: 'A1', movable: true },
      { x: 2, y: 1, letter: 'T', value: 1, id: 'T1', movable: true },
      { x: 1, y: 2, letter: 'J', value: 1, id: 'J1', movable: true },
      { x: 3, y: 5, letter: 'Z', value: 10, id: 'Z1', movable: true },
    ]

    board = { tiles, size: 7 }

    words = Board.findWords(board)
  })

  it('should find horizontal words', () => {
    const cat = [
      { x: 0, y: 1, letter: 'C', value: 3, id: 'C1', movable: true },
      { x: 1, y: 1, letter: 'A', value: 1, id: 'A1', movable: true },
      { x: 2, y: 1, letter: 'T', value: 1, id: 'T1', movable: true },
    ]
    expect(words).toContainEqual(cat)
  })
})
