import { Board, boardByAddingTile, boardWithoutTile, Side } from '../Board'
import { Action, ActionID, Dispatch } from '../constants'
import { Rack, RackList, State } from '../state'

import { sampleN } from '../TileBag'

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

          const pos = _.findIndex(
            rack.tiles,
            t => t && t.id === rack.selectedTileID
          )
          const tile = rack.tiles[pos]!

          board = boardByAddingTile(state.board, tile, action.value)

          rack[pos] = null
          // TODO: We should probably just store selectedTile as (id, pos)
          delete rack.selectedTileID

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
        const { x, y } = action.value

        if (!state.racks[player].selectedTileID) {
          return state
        }

        const boardTile = state.board.tiles.find(t => {
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

        return { ...state, racks, board }
      case ActionID.GENERATE_BOARD:
        const size = action.value
        const availableSides: string[] = _.shuffle(Object.keys(Side))

        // TODO: This is a hack to stop it so that we don't end up with an
        // entrance/exit in the same tile (if they're at a corner).
        // We should properly be detecting that specific condition, but this is easier
        const availablePositions: number[] = Array.from(Array(size).keys())

        const entrance = {
          position: availablePositions.pop()!,
          side: Side[availableSides.pop()!],
        }
        const exit = {
          position: availablePositions.pop()!,
          side: Side[availableSides.pop()!],
        }

        board = {
          entrance,
          exit,
          exitIsComplete: false,
          size,
          tiles: [],
        }
        return { ...state, board }
      default:
        return state
    }
  }
}
