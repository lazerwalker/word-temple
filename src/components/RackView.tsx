import * as React from 'react'
import { connect } from 'react-redux'

import State from '../state'
import { Tile } from '../Tile'
import RackTileView from './RackTileView'

import { Dispatch } from 'redux'
import { swapRackTiles } from '../actions'

interface StateProps {
  tiles: Tile[]
}

interface OwnProps {
  player: string
}

interface DispatchProps {
  onDragTile: (tileIndex1: number, tileIndex2: number) => void
}

const RackView = (props: StateProps & OwnProps & DispatchProps) => {
  const tiles = props.tiles.map((tile, idx) => {
    return (
      <RackTileView
        index={idx}
        tile={tile}
        onDragTile={props.onDragTile}
        key={`rack-${idx}`}
      />
    )
  })

  return <div className="rack">{tiles}</div>
}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  const rack = state.racks[ownProps.player]
  if (rack && rack.tiles) {
    return {
      tiles: [...rack.tiles],
    }
  } else {
    return { tiles: [] }
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<State>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    onDragTile: (tileIndex1: number, tileIndex2: number) => {
      dispatch(swapRackTiles(tileIndex1, tileIndex2, ownProps.player))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RackView)
