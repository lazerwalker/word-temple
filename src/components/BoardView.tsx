import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { State } from '../types';

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

const mapStateToProps = (state: State, ownProps: any) => {
  return state.board;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardView);