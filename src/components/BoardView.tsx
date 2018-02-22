import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'

import { moveBoardTile, playTile, swapWithBoardTile } from '../actions'
import State from '../state'

import { Dispatch } from 'redux'
import { Portal, Side } from '../Board'
import { BoardTile } from '../Tile'
import BoardTileView, { DragBoardTile } from './BoardTileView'

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
  onEmptyTileDrag: (
    tileIndex: number | DragBoardTile,
    x: number,
    y: number
  ) => void
  onExistingTileDrag: (
    tileIndex: number | DragBoardTile,
    boardTile: BoardTile
  ) => void
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
      let dragFn:
        | ((tileIndex: number, boardTile?: BoardTile) => void)
        | undefined
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
        dragFn = (tileIndex: number | DragBoardTile, boardTile: BoardTile) => {
          if (props.onExistingTileDrag) {
            props.onExistingTileDrag(tileIndex, boardTile)
          }
        }
      } else {
        dragFn = (tileIndex: number | DragBoardTile) => {
          if (props.onEmptyTileDrag) {
            props.onEmptyTileDrag(tileIndex, x, y)
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

// TODO: There should really be a separate board drag fn threaded through :/
const mapDispatchToProps = (
  dispatch: Dispatch<State>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    onEmptyTileDrag: (
      tileIndex: number | DragBoardTile,
      x: number,
      y: number
    ) => {
      if (_.isNumber(tileIndex)) {
        dispatch(playTile(tileIndex, x, y, ownProps.player))
      } else {
        dispatch(moveBoardTile(tileIndex, { x, y }))
      }
    },
    onExistingTileDrag: (
      tileIndex: number | DragBoardTile,
      boardTile: BoardTile
    ) => {
      if (_.isNumber(tileIndex)) {
        dispatch(swapWithBoardTile(tileIndex, boardTile, ownProps.player))
      } else {
        dispatch(moveBoardTile(tileIndex, { x: boardTile.x, y: boardTile.y }))
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardView)
