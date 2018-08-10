import * as React from 'react'

import * as classNames from 'classnames'
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
import { Portal } from '../Board'
import { DragBoardTile, DragTile, DragTypes } from '../constants'
import { BoardTile } from '../Tile'
import PortalView from './PortalView'
import TileView from './TileView'

interface Props {
  tile?: BoardTile
  entrance?: Portal
  exit?: Portal
  onDrag: (tileIndex: number | DragBoardTile, boardTile?: BoardTile) => void
  onPortalSelect: (x: number, y: number) => void
}

interface DNDProps {
  connectDragSource: ConnectDragSource
  connectDropTarget: ConnectDropTarget
  isDragging: boolean
}

const BoardTileView = (props: Props & DNDProps) => {
  const {
    connectDropTarget,
    connectDragSource,
    entrance,
    exit,
    tile,
    onPortalSelect,
  } = props

  const classes = classNames('board-tile', {
    empty: tile === undefined,
  })

  // TODO: `Portal` should probably encapsulate whether it's an entrance or exit? Does it matter?
  // TODO: We should have a PortalView component?
  const portal = entrance || exit || undefined

  let portalView
  if (portal) {
    portalView = (
      <PortalView
        side={portal.side}
        open={portal.open}
        x={portal.x}
        y={portal.y}
        onSelect={onPortalSelect}
      />
    )
  }

  if (tile) {
    let tileView = connectDropTarget(
      <div className={classes}>
        <TileView
          letter={tile.letter}
          value={tile.value}
          validity={tile.validity}
          movable={tile.movable}
          isDragging={props.isDragging}
        />
        {portalView}
      </div>
    )

    if (tile.movable) {
      tileView = connectDragSource(tileView)
    }

    return tileView
  } else {
    return connectDropTarget(
      <div className={classes}>
        <TileView />
        {portalView}
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
    isDragging: monitor.isDragging(),
  }
}

export default DropTarget<Props>(
  [DragTypes.Tile, DragTypes.BoardTile],
  tileTarget,
  collectDrop
)(DragSource(DragTypes.BoardTile, tileSource, collectDrag)(BoardTileView))
