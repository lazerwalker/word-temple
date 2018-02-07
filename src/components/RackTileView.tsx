import * as React from 'react';

import { Tile } from '../Tile';

import TileView from './TileView';

interface Props {
  tile?: Tile;
  isSelected: boolean;
  onSelectTile: (tile: Tile) => void;
  onDeselectTile: () => void;
}

class RackTileView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.props.tile) {
      if (this.props.isSelected) {
        this.props.onDeselectTile();
      } else {
        this.props.onSelectTile(this.props.tile);
      }
    }
  }

  render() {
    if (this.props.tile) {
      return (
        <div className="rack-tile" onClick={this.onClick}>
          <TileView
            letter={this.props.tile.letter}
            value={this.props.tile.value}
            isSelected={this.props.isSelected}
          />
        </div>
      );
    } else {
      return <div className="tile empty" />;
    }
  }
}

export default RackTileView;
