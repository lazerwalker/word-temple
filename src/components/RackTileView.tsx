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
  isSelected: boolean
  onSelectTile: (tile: Tile) => void
  onDeselectTile: () => void

  onDragTile?: (origin: Tile, destination?: Tile) => void

  connectDragSource?: any
  connectDropTarget?: any
}

class RackTileView extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  public render() {
    const {
      connectDragSource,
      connectDropTarget,
      isSelected,
      tile,
    } = this.props

    if (tile) {
      return connectDropTarget(
        connectDragSource(
          <div className="rack-tile" onClick={this.onClick}>
            <TileView
              letter={tile.letter}
              value={tile.value}
              isSelected={isSelected}
            />
          </div>
        )
      )
    } else {
      return <div className="tile empty" />
    }
  }

  private onClick() {
    if (this.props.tile) {
      if (this.props.isSelected) {
        this.props.onDeselectTile()
      } else {
        this.props.onSelectTile(this.props.tile)
      }
    }
  }
}

export default DropTarget(DragTypes.Tile, tileTarget, collectDrop)(
  DragSource(DragTypes.Tile, tileSource, collectDrag)(RackTileView)
)
