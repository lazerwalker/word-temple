import * as React from 'react';

import TileView from './TileView';

interface Props {
  letter?: string;
  value?: number;
}

interface State {
  isSelected: boolean;
  isInRack: boolean;
}

class RackTileView extends React.Component<Props, State> {
  getInitialState() {
    return { isSelected: false, isInRack: false };
  }

  didTap() {
    if (!this.state.isInRack) { return; }

    this.setState({isSelected: !this.state.isSelected});
  }

  render() {
    if (!this.state) { this.state = this.getInitialState(); }

    if (this.props.letter) {
      return (
        <div className={this.state.isSelected ? "tile selected" : "tile"} onClick={this.didTap}>
          <TileView letter={this.props.letter} value={this.props.value} />
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