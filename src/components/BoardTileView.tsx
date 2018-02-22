import * as React from 'react'

import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
} from 'react-dnd'
import { DragBoardTile, DragTile, DragTypes } from '../constants'
import { BoardTile } from '../Tile'
import TileView from './TileView'

interface Props {
  tile?: BoardTile
  entrance?: string
  exit?: string
  exitIsComplete?: boolean
  onDrag: (tileIndex: number | DragBoardTile, boardTile?: BoardTile) => void
}

interface DNDProps {
  connectDragSource: ConnectDragSource
  connectDropTarget: ConnectDropTarget
}

const BoardTileView = (props: Props & DNDProps) => {
  const classNames = ['board-tile']

  const {
    connectDropTarget,
    connectDragSource,
    entrance,
    exit,
    exitIsComplete,
    tile,
  } = props

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
    let tileView = connectDropTarget(
      <div className={classNames.join(' ')}>
        <TileView
          letter={tile.letter}
          value={tile.value}
          validity={tile.validity}
          movable={tile.movable}
        />
      </div>
    )

    if (tile.movable) {
      tileView = connectDragSource(tileView)
    }

    return tileView
  } else {
    classNames.push('empty')
    return connectDropTarget(
      <div className={classNames.join(' ')}>
        <TileView />
      </div>
    )
  }
}

const tileTarget = {
  drop(props: Props & DNDProps, monitor: DropTargetMonitor) {
    const itemType = monitor.getItemType()
    if (itemType === DragTypes.Tile) {
      const tileIndex = (monitor.getItem() as DragTile).index
      const boardTile = props.tile
      if (props.onDrag) {
        props.onDrag(tileIndex, boardTile)
      }
    } else if (itemType === DragTypes.BoardTile) {
      const position = monitor.getItem() as DragBoardTile
      const boardTile = props.tile
      if (props.onDrag) {
        props.onDrag(position, boardTile)
      }
    }
  },
}

const tileSource = {
  beginDrag(props: Props): DragBoardTile {
    const { x, y, letter, value } = props.tile!
    return { x, y, letter, value }
  },
}

function collectDrop(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

function collectDrag(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

export default DropTarget<Props>(
  [DragTypes.Tile, DragTypes.BoardTile],
  tileTarget,
  collectDrop
)(DragSource(DragTypes.BoardTile, tileSource, collectDrag)(BoardTileView))
