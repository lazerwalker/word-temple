import {
  Board,
  boardByAddingTile,
  boardTileAtPosition,
  boardWithoutTile,
  generateNewBoard,
} from '../Board'
import { Action, ActionID, Dispatch } from '../constants'
import { Rack, RackList, State } from '../state'

import { sampleN } from '../TileBag'

import { BoardTile, Tile } from '../Tile'

// TODO: This blob of definitions has led me to errors that the type system should have caught.
// Remove this, and probably change tslint?
let rack: Rack
let racks: RackList
let board: Board
let tile: Tile
let tileIndex: number
let boardTile: BoardTile
let tiles
let newBag
let player: string

export default function createReducer(
  isHost: boolean,
  networkDispatch?: Dispatch
): ((state: State, action: Action) => State) {
  return (state: State, action: Action) => {
    console.log('In dispatch', action)
    if (
      !isHost &&
      action.type !== ActionID.OVERWRITE_STATE &&
      networkDispatch
    ) {
      networkDispatch(action)
    }

    switch (action.type) {
      case ActionID.OVERWRITE_STATE:
        if (isHost) {
          return state
        }
        // TODO: Be smart about multiple tile racks
        return { ...state, ...action.value }
      case ActionID.CREATE_NEW_RACK:
        ;[tiles, newBag] = sampleN(state.bag, 7)
        rack = { tiles }

        racks = { ...state.racks }

        board = state.board
        if (Object.keys(racks).length === 0) {
          board = generateNewBoard(7)
        }

        racks[action.value] = rack
        return { ...state, racks, board, bag: newBag }
      case ActionID.DRAW_TILES:
        player = action.value.player
        const count = action.value.count
        ;[tiles, newBag] = sampleN(state.bag, count)

        racks = { ...state.racks }
        rack = { ...racks[player] }

        tiles.forEach(t => {
          const nullPos = rack.tiles.indexOf(null!)
          if (nullPos !== -1) {
            rack.tiles[nullPos] = t
          } else {
            rack.tiles.push(t)
          }
        })

        racks[player] = rack
        return { ...state, racks, bag: newBag }
      case ActionID.GENERATE_BOARD:
        const size = action.value
        board = generateNewBoard(size)
        return { ...state, board }
      case ActionID.PLAY_TILE:
        player = action.value.player
        tileIndex = action.value.tileIndex
        const boardPos = action.value.position

        racks = { ...state.racks }
        rack = { ...racks[player] }

        tile = rack.tiles[tileIndex]

        board = boardByAddingTile(state.board, tile, boardPos)

        const [newTile, bag] = sampleN(state.bag, 1)
        rack.tiles[tileIndex] = newTile[0]
        racks[player] = rack

        if (board.exitIsComplete) {
          // TODO
          board = generateNewBoard(board.size, board.exits![0])
        }

        return { ...state, board, racks, bag }
      case ActionID.SWAP_WITH_BOARD_TILE:
        player = action.value.player
        tileIndex = action.value.tileIndex
        boardTile = action.value.boardTile

        racks = { ...state.racks }
        rack = { ...racks[player] }

        tile = rack.tiles[tileIndex]

        board = boardWithoutTile(state.board, boardTile)
        board = boardByAddingTile(board, tile, {
          x: boardTile.x,
          y: boardTile.y,
        })

        rack.tiles[tileIndex] = {
          id: boardTile.id,
          letter: boardTile.letter,
          value: boardTile.value,
        }

        racks[player] = rack

        if (board.exitIsComplete) {
          // TODO
          board = generateNewBoard(board.size, board.exits![0])
        }

        return { ...state, board, racks }
      case ActionID.SWAP_RACK_TILES:
        player = action.value.player
        const pos1 = action.value.tileIndex1
        const pos2 = action.value.tileIndex2

        racks = { ...state.racks }
        rack = { ...racks[player] }

        const tile1 = rack.tiles[pos1]
        const tile2 = rack.tiles[pos2]

        rack.tiles[pos1] = tile2
        rack.tiles[pos2] = tile1

        racks[player] = rack
        return { ...state, racks }
      case ActionID.MOVE_BOARD_TILE:
        const { from, to } = action.value
        const fromTile = boardTileAtPosition(state.board, from.x, from.y)
        const toTile = boardTileAtPosition(state.board, to.x, to.y)

        if (!fromTile) {
          return state
        }

        board = { ...state.board }
        board = boardWithoutTile(board, fromTile)
        board = boardByAddingTile(board, fromTile, to)

        if (toTile) {
          board = boardWithoutTile(board, toTile)
          board = boardByAddingTile(board, toTile, from)
        }

        return { ...state, board }
      default:
        return state
    }
  }
}
