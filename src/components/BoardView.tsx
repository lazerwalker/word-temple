import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'

import { drawTiles, placeTile, swapBoardTile } from '../actions'
import State from '../state'

import { Portal, Side } from '../Board'
import { BoardTile } from '../Tile'
import BoardTileView from './BoardTileView'

interface BoardProps {
  player: string
  size: number
  tiles: BoardTile[]
  entrance?: Portal
  exit?: Portal
  onEmptyTileTap: (x: number, y: number) => void
  onExistingTileTap: (x: number, y: number) => void
}

class BoardView extends React.Component<BoardProps> {
  public render() {
    let entrancePos: { x: number; y: number }
    let exitPos: { x: number; y: number }

    // TODO: Move this into mapStateToProps?
    if (this.props.entrance) {
      switch (this.props.entrance.side) {
        case Side.Left:
          entrancePos = { x: 0, y: this.props.entrance.position }
          break
        case Side.Right:
          entrancePos = { x: this.props.size, y: this.props.entrance.position }
          break
        case Side.Bottom:
          entrancePos = { x: this.props.entrance.position, y: this.props.size }
          break
        case Side.Top:
          entrancePos = { x: this.props.entrance.position, y: 0 }
          break
        default:
          break
      }
    }

    if (this.props.exit) {
      console.log('Has exit', this.props.exit)
      switch (this.props.exit.side) {
        case Side.Left:
          exitPos = { x: 0, y: this.props.exit.position }
          break
        case Side.Right:
          exitPos = { x: this.props.size - 1, y: this.props.exit.position }
          break
        case Side.Bottom:
          exitPos = { x: this.props.exit.position, y: this.props.size - 1 }
          break
        case Side.Top:
          exitPos = { x: this.props.exit.position, y: 0 }
          break
        default:
          console.log('IN DEFAULT')
          break
      }
    }

    console.log(entrancePos!, exitPos!)

    const tiles = _.range(this.props.size).map(y => {
      return _.range(this.props.size).map(x => {
        let tapFn: (() => void) | undefined
        let exit: string | undefined
        let entrance: string | undefined

        if (this.props.entrance && entrancePos.x === x && entrancePos.y === y) {
          console.log('Has entrance', x, y)
          entrance = this.props.entrance.side
        }

        // console.log(exitPos, x, y, (this.props.exit && exitPos.x === x && exitPos.y === y))
        if (this.props.exit && exitPos.x === x && exitPos.y === y) {
          console.log('Has exit', x, y)
          exit = this.props.exit.side
        }

        const tile = _(this.props.tiles).find(t => t.x === x && t.y === y)
        if (tile) {
          tapFn = () => {
            if (this.props.onExistingTileTap) {
              this.props.onExistingTileTap(x, y)
            }
          }
        } else {
          tapFn = () => {
            if (this.props.onEmptyTileTap) {
              this.props.onEmptyTileTap(x, y)
            }
          }
        }

        return (
          <BoardTileView
            onTap={tapFn}
            entrance={entrance}
            exit={exit}
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
}

const mapStateToProps = (state: State, ownProps: {}) => {
  return state.board
}

const mapDispatchToProps = (dispatch: any, ownProps: BoardProps) => {
  return {
    onEmptyTileTap: (x: number, y: number) => {
      dispatch(placeTile(ownProps.player, x, y))
      dispatch(drawTiles(ownProps.player, 1))
    },
    onExistingTileTap: (x: number, y: number) => {
      dispatch(swapBoardTile(ownProps.player, x, y))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardView)
