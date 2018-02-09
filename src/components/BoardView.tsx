import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'

import { playTile, swapWithBoardTile } from '../actions'
import State from '../state'

import { Portal, Side } from '../Board'
import { BoardTile, Tile } from '../Tile'
import BoardTileView from './BoardTileView'

interface BoardProps {
  player: string
  size: number
  tiles: BoardTile[]
  entrance?: Portal
  exit?: Portal
  exitIsComplete: boolean

  onEmptyTileDrag: (tile: Tile, x: number, y: number) => void
  onExistingTileDrag: (tile: Tile, boardTile: BoardTile) => void
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
          entrancePos = {
            x: this.props.size - 1,
            y: this.props.entrance.position,
          }
          break
        case Side.Bottom:
          entrancePos = {
            x: this.props.entrance.position,
            y: this.props.size - 1,
          }
          break
        case Side.Top:
          entrancePos = { x: this.props.entrance.position, y: 0 }
          break
        default:
          break
      }
    }

    if (this.props.exit) {
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
          break
      }
    }

    const tiles = _.range(this.props.size).map(y => {
      return _.range(this.props.size).map(x => {
        let dragFn: ((tile: Tile, boardTile?: BoardTile) => void) | undefined
        let exit: string | undefined
        let entrance: string | undefined

        if (this.props.entrance && entrancePos.x === x && entrancePos.y === y) {
          entrance = this.props.entrance.side
        }

        if (this.props.exit && exitPos.x === x && exitPos.y === y) {
          exit = this.props.exit.side
        }

        const tile = _(this.props.tiles).find(t => t.x === x && t.y === y)
        if (tile) {
          dragFn = (tile: Tile, boardTile: BoardTile) => {
            console.log(tile)
            if (this.props.onExistingTileDrag) {
              this.props.onExistingTileDrag(tile, boardTile)
            }
          }
        } else {
          dragFn = (tile: Tile) => {
            if (this.props.onEmptyTileDrag) {
              this.props.onEmptyTileDrag(tile, x, y)
            }
          }
        }

        return (
          <BoardTileView
            onDrag={dragFn}
            entrance={entrance}
            exit={exit}
            exitIsComplete={this.props.exitIsComplete}
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
    onEmptyTileDrag: (tile: Tile, x: number, y: number) => {
      console.log('Empty drag exists', tile, x, y, ownProps.player)
      dispatch(playTile(tile, x, y, ownProps.player))
    },
    onExistingTileDrag: (tile: Tile, boardTile: BoardTile) => {
      console.log('Existing drag exists', tile, boardTile, ownProps.player)
      dispatch(swapWithBoardTile(tile, boardTile, ownProps.player))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardView)
