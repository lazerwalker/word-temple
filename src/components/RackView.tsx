import * as React from 'react';

import { Tile } from '../Tile';
import RackTileView from './RackTileView';

interface RackProps {
  tiles: Tile[];
}

class RackView extends React.Component<RackProps> {
  render() {
    const tiles = this.props.tiles.map((tile, idx) => {
      return <RackTileView letter={tile.letter} value={tile.value} key={`rack-${idx}`} />;
    });

    return (
      <div className='rack'>
        {tiles}
      </div>
    );
  }
}

export default RackView;