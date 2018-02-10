import * as React from 'react'

import {
  ConnectDropTarget,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
} from 'react-dnd'
import { DragTypes } from '../constants'
import { BoardTile, Tile } from '../Tile'
import TileView from './TileView'

const tileTarget = {
  drop(props: Props & DNDProps, monitor: DropTargetMonitor) {
    const tile = monitor.getItem() as Tile
    const boardTile = props.tile
    if (props.onDrag) {
      props.onDrag(tile, boardTile)
    }
  },
}

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

interface Props {
  tile?: BoardTile
  entrance?: string
  exit?: string
  exitIsComplete?: boolean
  onDrag: (tile: Tile, boardTile?: BoardTile) => void
}

interface DNDProps {
  connectDropTarget: ConnectDropTarget
}

const BoardTileView = (props: Props & DNDProps) => {
  const classNames = ['board-tile']

  const { connectDropTarget, entrance, exit, exitIsComplete, tile } = props

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
      <div className={classNames.join(' ')}>
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
      <div className={classNames.join(' ')}>
        <TileView />
      </div>
    )
  }
}

export default DropTarget<Props>(DragTypes.Tile, tileTarget, collect)(
  BoardTileView
)
