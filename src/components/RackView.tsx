import * as React from 'react';
import { connect } from 'react-redux';

import { Tile } from '../Tile';
import RackTileView from './RackTileView';
import State from '../state';

import { chooseRackTile, deselectRackTile } from '../actions';

interface RackProps {
  player: string;
  tiles: Tile[];
  selectedTileID?: string;
  onSelectTile: (tile: Tile) => void;
  onDeselectTile: () => void;
}

class RackView extends React.Component<RackProps> {
  render() {
    const tiles = this.props.tiles.map((tile, idx) => {
      const isSelected = (this.props.selectedTileID !== undefined &&
        tile.id === this.props.selectedTileID);
      return (
        <RackTileView
          tile={tile}
          isSelected={isSelected}
          onSelectTile={this.props.onSelectTile}
          onDeselectTile={this.props.onDeselectTile}
          key={`rack-${idx}`}
        />
      );
    });

    return (
      <div className='rack'>
        {tiles}
      </div>
    );
  }
}

const mapStateToProps = (state: State, ownProps: any) => {
  return state.racks[ownProps.player] || {tiles: []};
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onSelectTile: (tile: Tile) => {
      dispatch(chooseRackTile(ownProps.player, tile));
    },

    onDeselectTile: () => {
      dispatch(deselectRackTile(ownProps.player));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RackView);