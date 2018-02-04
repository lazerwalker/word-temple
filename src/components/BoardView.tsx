import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import State from '../state';
import { drawTiles, placeTile, swapBoardTile } from '../actions';

import { BoardTile } from '../Tile';
import BoardTileView from './BoardTileView';

interface BoardProps {
  player: string;
  size: number;
  tiles: BoardTile[];
  onEmptyTileTap: (x: number, y: number) => void;
  onExistingTileTap: (x: number, y: number) => void;
}

class BoardView extends React.Component<BoardProps> {
  render() {
    const tiles = _.range(this.props.size).map((y) => {
      return _.range(this.props.size).map((x) => {
        const tile = _(this.props.tiles).find((t) => t.x === x && t.y === y);
        if (tile) {
          const tapFn = () => {
            if (this.props.onExistingTileTap) {
              this.props.onExistingTileTap(x, y);
            }
          };
          return <BoardTileView onTap={tapFn} tile={tile} key={`tile-${x}-${y}`} />;
        } else {
          const tapFn = () => {
            if (this.props.onEmptyTileTap) {
              this.props.onEmptyTileTap(x, y);
            }
          };

          return <BoardTileView onTap={tapFn} key={`tile-${x}-${y}`} />;
        }
      });
    });

    const tileRows = tiles.map((row, i) => {
      return (
        <div className='tile-row' key={i}>
          {row}
        </div>
      );
    })

    return (
      <div className='board'>
        {tileRows}
      </div>
    );
  }
}

const mapStateToProps = (state: State, ownProps: any) => {
  return state.board;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onEmptyTileTap: (x: number, y: number) => {
      dispatch(placeTile(ownProps.player, x, y));
      dispatch(drawTiles(ownProps.player, 1));
    },
    onExistingTileTap: (x: number, y: number) => {
      dispatch(swapBoardTile(ownProps.player, x, y));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardView);