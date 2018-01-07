import * as React from 'react';
import * as _ from 'lodash';

import { BoardTile } from '../Tile';
import BoardTileView from './BoardTileView';

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
          return <BoardTileView tile={tile} key={`tile-${x}-${y}`} />;
        } else {
          return <BoardTileView key={`tile-${x}-${y}`} />;
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