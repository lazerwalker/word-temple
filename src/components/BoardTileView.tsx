import * as React from 'react'

import { DropTarget } from 'react-dnd'
import { DragTypes } from '../constants'
import { BoardTile, Tile } from '../Tile'
import TileView from './TileView'

// Tomorrow todo:
// Just do a fucking 'onSwapTileByDrag' and 'onPlaceTileByDrag' fns created in the BoardView and passed in
const tileTarget = {
  drop(props: BoardTileViewProps, monitor: any) {
    const tile = monitor.getItem()
    const boardTile = props.tile
    if (props.onDrag) {
      props.onDrag(tile, boardTile)
    }
  },
}

function collect(connect: any, monitor: any) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

interface BoardTileViewProps {
  tile?: BoardTile
  entrance?: string
  exit?: string
  exitIsComplete?: boolean

  onTap?: () => void
  onDrag?: (tile: Tile, boardTile?: BoardTile) => void
  connectDropTarget?: any

  dispatch?: any
}

class BoardTileView extends React.Component<BoardTileViewProps> {
  public render() {
    const classNames = ['board-tile']

    const {
      connectDropTarget,
      entrance,
      exit,
      exitIsComplete,
      onTap,
      tile,
    } = this.props

    if (entrance) {
      classNames.push(`entrance-${entrance}`)
    }

    if (exit) {
      classNames.push(`exit-${exit}`)
      if (exitIsComplete) {
        classNames.push('exit-complete')
      }
    }

    if (tile) {
      return connectDropTarget(
        <div className={classNames.join(' ')} onClick={onTap}>
          <TileView
            letter={tile.letter}
            value={tile.value}
            validity={tile.validity}
            movable={tile.movable}
          />
        </div>
      )
    } else {
      classNames.push('empty')
      return connectDropTarget(
        <div className={classNames.join(' ')} onClick={onTap}>
          <TileView />
        </div>
      )
    }
  }
}

export default DropTarget(DragTypes.Tile, tileTarget, collect)(BoardTileView)
