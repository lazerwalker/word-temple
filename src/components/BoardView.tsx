import * as React from 'react';
import * as _ from 'lodash';

import { BoardTile } from '../Tile';
import TileView from './TileView';

interface BoardProps {
  size: number;
  tiles: BoardTile[];
}

class BoardView extends React.Component<BoardProps> {
  render() {
    const tiles = _.range(this.props.size).map((y) => {
      return _.range(this.props.size).map((x) => {
        const tile = _(this.props.tiles).find((t) => t.x === x && t.y === y);
        if (tile) {
          return <TileView letter={tile.letter} value={tile.value} key={`tile-${x}-${y}`} />;
        } else {
          return <TileView key={`tile-${x}-${y}`} />;
        }
      });
    });

    return (
      <div className='board'>
        {tiles}
      </div>
    );
  }
}

export default BoardView;