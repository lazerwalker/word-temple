import * as React from 'react';
import { connect } from 'react-redux';

import { Tile } from '../Tile';
import RackTileView from './RackTileView';
import { State } from '../types';

import { selectRackTile } from '../actions';

interface RackProps {
  tiles: Tile[];
  selectedTile?: Tile;
  onTapTile: (tile: Tile) => void;
}

class RackView extends React.Component<RackProps> {
  render() {
    const tiles = this.props.tiles.map((tile, idx) => {
      const isSelected = (tile === this.props.selectedTile);

      return (
        <RackTileView
          tile={tile}
          isSelected={isSelected}
          onTapTile={this.props.onTapTile}
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
  return state.rack;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onTapTile: (tile: Tile) => {
      dispatch(selectRackTile(tile));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RackView);