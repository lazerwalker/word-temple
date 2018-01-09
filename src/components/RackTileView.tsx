import * as React from 'react';

import { Tile } from '../Tile';

import TileView from './TileView';

interface Props {
  tile?: Tile;
  isSelected: boolean;
  onTapTile: (tile: Tile) => void;
}

class RackTileView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.props.tile) {
      this.props.onTapTile(this.props.tile);
    }
  }

  render() {
    if (this.props.tile) {
      return (
        <div className="tile" onClick={this.onClick}>
          <TileView
            letter={this.props.tile.letter}
            value={this.props.tile.value}
            isSelected={this.props.isSelected}
          />
        </div>
      );
    } else {
      return (
        <div className='tile empty'/>
      );
    }
  }
}

export default RackTileView;