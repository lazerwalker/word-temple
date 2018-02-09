import * as React from 'react'

import { Tile } from '../Tile'

import { DragSource } from 'react-dnd'
import { DragTypes } from '../constants'
import TileView from './TileView'

const tileSource = {
  beginDrag(props: Props): Tile {
    return { ...props.tile! }
  },
}

function collect(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

interface Props {
  tile?: Tile
  isSelected: boolean
  onSelectTile: (tile: Tile) => void
  onDeselectTile: () => void

  connectDragSource?: any
  dispatch?: any
}

class RackTileView extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  public render() {
    const { connectDragSource, isSelected, tile } = this.props

    if (tile) {
      return connectDragSource(
        <div className="rack-tile" onClick={this.onClick}>
          <TileView
            letter={tile.letter}
            value={tile.value}
            isSelected={isSelected}
          />
        </div>
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

export default DragSource(DragTypes.Tile, tileSource, collect)(RackTileView)
