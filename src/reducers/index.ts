import { Action, ActionID, Dispatch } from '../constants'
import { State, Rack, RackList } from '../state'
import { Board } from '../Board'

import { sampleN } from '../TileBag'

import { boardByAddingTile, boardWithoutTile } from '../Board'

import * as _ from 'lodash'

// TODO: This blob of definitions has led me to errors that the type system should have caught.
// Remove this, and probably change tslint?
let rack: Rack
let racks: RackList
let board: Board
let tiles
let newBag
let player: string
let tileID: string

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

          let pos = _.findIndex(rack.tiles, t => t && t.id === tileID)
          let tile = rack.tiles[pos]!

          board = boardByAddingTile(state.board, tile, action.value)

          // TODO: We should probably just store selectedTile as (id, pos)
          rack.tiles[pos] = null
          delete rack.selectedTileID

          racks[player] = rack
          console.log(rack)
          return { ...state, board, racks }
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
          const nullPos = rack.tiles.indexOf(null)
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

        const pos1 = _.findIndex(rack.tiles, t => t && t.id === tileID)
        const pos2 = _.findIndex(
          rack.tiles,
          t => t && t.id === rack.selectedTileID
        )

        const selectedTile = rack.tiles[pos2]

        rack.tiles[pos2] = rack.tiles[pos1]
        rack.tiles[pos1] = selectedTile
        delete rack.selectedTileID

        racks[player] = rack
        return { ...state, racks }
      case ActionID.SWAP_BOARD_TILE:
        player = action.value.player
        let { x, y } = action.value

        if (!state.racks[player].selectedTileID) {
          return state
        }

        const boardTile = state.board.tiles.find(t => {
          return t.x === x && t.y === y
        })
        if (!boardTile) {
          return state
        }

        racks = { ...state.racks }
        rack = { ...racks[player] }
        const pos = _.findIndex(
          rack.tiles,
          t => t && t.id === rack.selectedTileID
        )

        let previouslySelectedTile = rack.tiles[pos]!

        rack.tiles = rack.tiles.slice(0)
        rack.tiles[pos] = boardTile
        delete rack.selectedTileID
        racks[player] = rack

        board = boardWithoutTile(state.board, boardTile)
        board = boardByAddingTile(board, previouslySelectedTile, action.value)

        return { ...state, racks, board }
      default:
        return state
    }
  }
}
