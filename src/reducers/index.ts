import {
  Board,
  boardByAddingTile,
  boardWithoutTile,
  generateNewBoard,
} from '../Board'
import { Action, ActionID, Dispatch } from '../constants'
import { Rack, RackList, State } from '../state'

import { sampleN } from '../TileBag'

import * as _ from 'lodash'
import { Tile, BoardTile } from '../Tile'

// TODO: This blob of definitions has led me to errors that the type system should have caught.
// Remove this, and probably change tslint?
let rack: Rack
let racks: RackList
let board: Board
let tile: Tile
let boardTile: BoardTile | undefined
let rackPos: number
let tiles
let newBag
let player: string
let tileID: string
let pos1: number
let pos2: number

export default function createReducer(
  isHost: boolean,
  networkDispatch: Dispatch
) {
  return (state: State, action: Action) => {
    if (!isHost && action.type !== ActionID.OVERWRITE_STATE) {
      networkDispatch(action)
    }

    switch (action.type) {
      case ActionID.OVERWRITE_STATE:
        if (isHost) {
          return
        }
        // TODO: Be smart about multiple tile racks
        return { ...state, ...action.value }
      case ActionID.SELECT_RACK_TILE:
        player = action.value.player
        tileID = action.value.tile

        racks = { ...state.racks }
        racks[player] = { ...racks[player], selectedTileID: tileID }

        return { ...state, racks }
      case ActionID.DESELECT_RACK_TILE:
        player = action.value

        racks = { ...state.racks }

        rack = { ...racks[player] }
        delete rack.selectedTileID
        racks[player] = rack

        return { ...state, racks }
      case ActionID.PLACE_TILE:
        player = action.value.player
        if (state.racks[player].selectedTileID) {
          racks = { ...state.racks }
          rack = { ...racks[player] }

          const pos = _.findIndex(
            rack.tiles,
            t => t && t.id === rack.selectedTileID
          )
          const tile = rack.tiles[pos]!

          board = boardByAddingTile(state.board, tile, action.value)

          if (board.exitIsComplete) {
            board = generateNewBoard(board.size, board.exit)
          }

          // TODO: We should probably just store selectedTile as (id, pos)
          // delete rack.selectedTileID

          // Draw 1 tile
          // TODO: Would be nice if we could just dispatch that as a separate
          // action instead of copypasta-ing here. This was moved in because we
          // were drawing in even when there was no selectedTile.
          const [newTile, bag] = sampleN(state.bag, 1)
          rack.tiles[pos] = newTile[0]
          racks[player] = rack
          return { ...state, board, racks, bag }
        }
        return state
      case ActionID.CREATE_NEW_RACK:
        ;[tiles, newBag] = sampleN(state.bag, 7)
        rack = { tiles }

        racks = { ...state.racks }
        racks[action.value] = rack
        return { ...state, racks, bag: newBag }
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
      case ActionID.SWAP_TILE_POSITION:
        player = action.value.player
        tileID = action.value.tile

        if (!state.racks[player].selectedTileID) {
          return state
        }

        racks = { ...state.racks }
        rack = { ...racks[player] }

        pos1 = _.findIndex(rack.tiles, t => t && t.id === tileID)
        pos2 = _.findIndex(rack.tiles, t => t && t.id === rack.selectedTileID)

        const selectedTile = rack.tiles[pos2]

        rack.tiles[pos2] = rack.tiles[pos1]
        rack.tiles[pos1] = selectedTile
        delete rack.selectedTileID

        racks[player] = rack
        return { ...state, racks }
      case ActionID.SWAP_BOARD_TILE:
        player = action.value.player
        const { x, y } = action.value

        if (!state.racks[player].selectedTileID) {
          return state
        }

        boardTile = state.board.tiles.find(t => {
          return t.x === x && t.y === y
        })

        if (!boardTile || !boardTile.movable) {
          return state
        }

        racks = { ...state.racks }
        rack = { ...racks[player] }
        const pos = _.findIndex(
          rack.tiles,
          t => t && t.id === rack.selectedTileID
        )

        const previouslySelectedTile = rack.tiles[pos]!

        rack.tiles = rack.tiles.slice(0)
        rack.tiles[pos] = boardTile
        delete rack.selectedTileID
        racks[player] = rack

        board = boardWithoutTile(state.board, boardTile)
        board = boardByAddingTile(board, previouslySelectedTile, action.value)

        if (board.exitIsComplete) {
          board = generateNewBoard(board.size, board.exit)
        }

        return { ...state, racks, board }
      case ActionID.GENERATE_BOARD:
        const size = action.value
        board = generateNewBoard(size)
        return { ...state, board }
      case ActionID.PLACE_TILE_BY_DRAG:
        console.log('PLacing by drag', action.value)
        player = action.value.player
        tile = action.value.tile
        const boardPos = action.value.position

        racks = { ...state.racks }
        rack = { ...racks[player] }

        board = boardByAddingTile(state.board, tile, boardPos)

        // TODO: Would be nice if the drag action passed in the index
        rackPos = _.findIndex(rack.tiles, t => t && t.id === tile.id)

        const [newTile, bag] = sampleN(state.bag, 1)
        rack.tiles[rackPos] = newTile[0]
        racks[player] = rack

        if (board.exitIsComplete) {
          board = generateNewBoard(board.size, board.exit)
        }

        return { ...state, board, racks, bag }
      case ActionID.SWAP_TILE_BY_DRAG:
        player = action.value.player
        tile = action.value.tile
        boardTile = action.value.boardTile

        racks = { ...state.racks }
        rack = { ...racks[player] }

        board = boardWithoutTile(state.board, boardTile)
        board = boardByAddingTile(board, tile, {
          x: boardTile.x,
          y: boardTile.y,
        })

        // TODO: Would be nice if the drag action passed in the index
        rackPos = _.findIndex(rack.tiles, t => t && t.id === tile.id)

        rack.tiles[rackPos] = {
          id: boardTile.id,
          letter: boardTile.letter,
          value: boardTile.value,
        }

        console.log(rackPos, rack.tiles[rackPos])

        racks[player] = rack

        if (board.exitIsComplete) {
          board = generateNewBoard(board.size, board.exit)
        }

        return { ...state, board, racks }
      case ActionID.SWAP_RACK_TILES:
        player = action.value.player
        const tileID1 = action.value.tile1
        const tileID2 = action.value.tile2

        racks = { ...state.racks }
        rack = { ...racks[player] }

        pos1 = _.findIndex(rack.tiles, t => t && t.id === tileID1)
        pos2 = _.findIndex(rack.tiles, t => t && t.id === tileID2)

        const firstTile = rack.tiles[pos1]

        rack.tiles[pos1] = rack.tiles[pos2]
        rack.tiles[pos2] = firstTile

        racks[player] = rack
        return { ...state, racks }
      default:
        return state
    }
  }
}
