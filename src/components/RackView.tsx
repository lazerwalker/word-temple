import * as React from 'react';
import { connect } from 'react-redux';

import { Tile } from '../Tile';
import RackTileView from './RackTileView';
import State from '../state';

import { chooseRackTile, deselectRackTile } from '../actions';

interface RackProps {
  player: string;
  tiles: Tile[];
  selectedTile?: Tile;
  onSelectTile: (tile: Tile) => void;
  onDeselectTile: () => void;
}

class RackView extends React.Component<RackProps> {
  render() {
    const tiles = this.props.tiles.map((tile, idx) => {
      const isSelected = (tile === this.props.selectedTile);

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
  return state.racks[ownProps.player];
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