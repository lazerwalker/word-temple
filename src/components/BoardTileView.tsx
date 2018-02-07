import * as React from 'react'

import { BoardTile } from '../Tile'
import TileView from './TileView'

interface BoardTileViewProps {
  tile?: BoardTile
  onTap?: () => void
}

class BoardTileView extends React.Component<BoardTileViewProps> {
  public render() {
    if (this.props.tile) {
      return (
        <div className="board-tile" onClick={this.props.onTap}>
          <TileView
            letter={this.props.tile.letter}
            value={this.props.tile.value}
            validity={this.props.tile.validity}
          />
        </div>
      )
    } else {
      return (
        <div className="board-tile empty" onClick={this.props.onTap}>
          <TileView />
        </div>
      )
    }
  }
}

export default BoardTileView
