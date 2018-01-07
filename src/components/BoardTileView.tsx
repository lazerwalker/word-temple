import * as React from 'react';

import TileView from './TileView';
import { Tile } from '../Tile';

interface BoardTileViewProps {
  tile?: Tile;
}

class BoardTileView extends React.Component<BoardTileViewProps> {
  render() {
    if (this.props.tile) {
      return (
        <div className="tile">
          <TileView letter={this.props.tile.letter} value={this.props.tile.value}/>
        </div>
      );
    } else {
      return <div className="tile empty"/>;
    }
  }
}

export default BoardTileView;