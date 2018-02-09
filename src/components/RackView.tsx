import * as React from 'react'
import { connect } from 'react-redux'

import State from '../state'
import { Tile } from '../Tile'
import RackTileView from './RackTileView'

import { swapRackTiles } from '../actions'

interface RackProps {
  player?: string
  tiles: Tile[]
  onDragTile?: (tile1: Tile, tile2: Tile) => void
}

class RackView extends React.Component<RackProps> {
  public render() {
    console.log(this.props.tiles)
    const tiles = this.props.tiles.map((tile, idx) => {
      return (
        <RackTileView
          tile={tile}
          onDragTile={this.props.onDragTile}
          key={`rack-${idx}`}
        />
      )
    })

    return <div className="rack">{tiles}</div>
  }
}

const mapStateToProps = (state: State, ownProps: RackProps) => {
  // TODO: This array stuff is a smell.
  const player = ownProps.player || 'host'
  return {
    selectedTileID: state.racks[player].selectedTileID,
    tiles: [...state.racks[player].tiles] || [],
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: RackProps) => {
  const player = ownProps.player || 'host'
  return {
    onDragTile: (tile1: Tile, tile2: Tile) => {
      dispatch(swapRackTiles(tile1, tile2, player))
    },
  }
}

export default connect<RackProps>(mapStateToProps, mapDispatchToProps)(RackView)
