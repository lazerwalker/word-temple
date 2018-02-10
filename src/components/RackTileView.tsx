import * as React from 'react'

import { Tile } from '../Tile'

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
import { DragTypes } from '../constants'
import TileView from './TileView'

interface Props {
  index: number
  tile: Tile
  onDragTile: (tileIndex1: number, tileIndex2: number) => void
}

interface DNDProps {
  connectDragSource: ConnectDragSource
  connectDropTarget: ConnectDropTarget
}

export interface DragTile {
  index: number
}

const RackTileView = (props: Props & DNDProps) => {
  const { connectDragSource, connectDropTarget, tile } = props

  if (tile) {
    return connectDropTarget!(
      connectDragSource!(
        <div className="rack-tile">
          <TileView letter={tile.letter} value={tile.value} />
        </div>
      )
    )
  } else {
    return <div className="tile empty" />
  }
}

const tileSource = {
  beginDrag(props: Props): { index: number } {
    return { index: props.index }
  },
}

const tileTarget = {
  drop(props: Props, monitor: DropTargetMonitor) {
    const destination = props.index
    const origin = (monitor.getItem() as DragTile).index
    if (props.onDragTile) {
      props.onDragTile(origin, destination)
    }
  },
}

function collectDrag(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

function collectDrop(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

export default DropTarget(DragTypes.Tile, tileTarget, collectDrop)(
  DragSource(DragTypes.Tile, tileSource, collectDrag)(RackTileView)
)
