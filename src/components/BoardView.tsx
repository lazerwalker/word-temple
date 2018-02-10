import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'

import { playTile, swapWithBoardTile } from '../actions'
import State from '../state'

import { Dispatch } from 'redux'
import { Portal, Side } from '../Board'
import { BoardTile, Tile } from '../Tile'
import BoardTileView from './BoardTileView'

interface OwnProps {
  player: string
}

interface StateProps {
  size: number
  tiles: BoardTile[]
  entrance?: Portal
  exit?: Portal
  exitIsComplete: boolean
}

interface DispatchProps {
  onEmptyTileDrag: (tile: Tile, x: number, y: number) => void
  onExistingTileDrag: (tile: Tile, boardTile: BoardTile) => void
}

const BoardView = (props: OwnProps & StateProps & DispatchProps) => {
  let entrancePos: { x: number; y: number }
  let exitPos: { x: number; y: number }

  // TODO: Move this into mapStateToProps?
  if (props.entrance) {
    switch (props.entrance.side) {
      case Side.Left:
        entrancePos = { x: 0, y: props.entrance.position }
        break
      case Side.Right:
        entrancePos = {
          x: props.size - 1,
          y: props.entrance.position,
        }
        break
      case Side.Bottom:
        entrancePos = {
          x: props.entrance.position,
          y: props.size - 1,
        }
        break
      case Side.Top:
        entrancePos = { x: props.entrance.position, y: 0 }
        break
      default:
        break
    }
  }

  if (props.exit) {
    switch (props.exit.side) {
      case Side.Left:
        exitPos = { x: 0, y: props.exit.position }
        break
      case Side.Right:
        exitPos = { x: props.size - 1, y: props.exit.position }
        break
      case Side.Bottom:
        exitPos = { x: props.exit.position, y: props.size - 1 }
        break
      case Side.Top:
        exitPos = { x: props.exit.position, y: 0 }
        break
      default:
        break
    }
  }

  const tiles = _.range(props.size).map(y => {
    return _.range(props.size).map(x => {
      let dragFn: ((tile: Tile, boardTile?: BoardTile) => void) | undefined
      let exit: string | undefined
      let entrance: string | undefined

      if (props.entrance && entrancePos.x === x && entrancePos.y === y) {
        entrance = props.entrance.side
      }

      if (props.exit && exitPos.x === x && exitPos.y === y) {
        exit = props.exit.side
      }

      const tile = _(props.tiles).find(t => t.x === x && t.y === y)
      if (tile) {
        dragFn = (tile: Tile, boardTile: BoardTile) => {
          if (props.onExistingTileDrag) {
            props.onExistingTileDrag(tile, boardTile)
          }
        }
      } else {
        dragFn = (tile: Tile) => {
          if (props.onEmptyTileDrag) {
            props.onEmptyTileDrag(tile, x, y)
          }
        }
      }

      return (
        <BoardTileView
          onDrag={dragFn}
          entrance={entrance}
          exit={exit}
          exitIsComplete={props.exitIsComplete}
          tile={tile}
          key={`tile-${x}-${y}`}
        />
      )
    })
  })

  const tileRows = tiles.map((row, i) => {
    return (
      <div className="tile-row" key={i}>
        {row}
      </div>
    )
  })

  return <div className="board">{tileRows}</div>
}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  return {
    ...state.board,
    exitIsComplete: state.board.exitIsComplete || false,
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<State>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    onEmptyTileDrag: (tile: Tile, x: number, y: number) => {
      dispatch(playTile(tile, x, y, ownProps.player))
    },
    onExistingTileDrag: (tile: Tile, boardTile: BoardTile) => {
      dispatch(swapWithBoardTile(tile, boardTile, ownProps.player))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardView)
