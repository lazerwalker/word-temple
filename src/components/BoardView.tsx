import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'

import { moveBoardTile, playTile, swapWithBoardTile } from '../actions'
import State from '../state'
import BoardTileView from './BoardTileView'

import { Dispatch } from 'redux'
import { Portal } from '../Board'
import { DragBoardTile } from '../constants'
import { BoardTile } from '../Tile'

interface OwnProps {
  player: string
}

interface StateProps {
  size: number
  tiles: BoardTile[]
  entrance: Portal
  exits: Portal[]
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
  const tiles = _.range(props.size).map(y => {
    return _.range(props.size).map(x => {
      let dragFn:
        | ((tileIndex: number, boardTile?: BoardTile) => void)
        | undefined
      let exit: string | undefined
      let entrance: string | undefined

      if (props.entrance.x === x && props.entrance.y === y) {
        entrance = props.entrance.side
      }

      const potentialExit = _.find(props.exits, p => p.x === x && p.y === y)
      if (potentialExit) {
        exit = potentialExit.side
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
