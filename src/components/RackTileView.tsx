import * as React from 'react'

import { Tile } from '../Tile'

import { DragSource, DropTarget } from 'react-dnd'
import { DragTypes } from '../constants'
import TileView from './TileView'

const tileSource = {
  beginDrag(props: Props): Tile {
    return { ...props.tile! }
  },
}

const tileTarget = {
  drop(props: Props, monitor: any) {
    const destination = props.tile
    const origin = monitor.getItem()
    if (props.onDragTile) {
      props.onDragTile(origin, destination)
    }
  },
}

function collectDrag(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

function collectDrop(connect: any, monitor: any) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

interface Props {
  tile?: Tile

  onDragTile?: (origin: Tile, destination?: Tile) => void

  connectDragSource?: any
  connectDropTarget?: any
}

class RackTileView extends React.Component<Props> {
  public render() {
    const { connectDragSource, connectDropTarget, tile } = this.props

    if (tile) {
      return connectDropTarget(
        connectDragSource(
          <div className="rack-tile">
            <TileView letter={tile.letter} value={tile.value} />
          </div>
        )
      )
    } else {
      return <div className="tile empty" />
    }
  }
}

export default DropTarget(DragTypes.Tile, tileTarget, collectDrop)(
  DragSource(DragTypes.Tile, tileSource, collectDrag)(RackTileView)
)
