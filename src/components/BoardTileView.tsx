import * as React from 'react'

import { BoardTile } from '../Tile'
import TileView from './TileView'

interface BoardTileViewProps {
  tile?: BoardTile
  onTap?: () => void
  entrance?: string
  exit?: string
}

class BoardTileView extends React.Component<BoardTileViewProps> {
  public render() {
    const classNames = ['board-tile']

    if (this.props.entrance) {
      classNames.push(`entrance-${this.props.entrance}`)
    }

    if (this.props.exit) {
      classNames.push(`exit-${this.props.exit}`)
    }

    if (this.props.tile) {
      return (
        <div className={classNames.join(' ')} onClick={this.props.onTap}>
          <TileView
            letter={this.props.tile.letter}
            value={this.props.tile.value}
            validity={this.props.tile.validity}
          />
        </div>
      )
    } else {
      classNames.push('empty')
      return (
        <div className={classNames.join(' ')} onClick={this.props.onTap}>
          <TileView />
        </div>
      )
    }
  }
}

export default BoardTileView
