import * as React from 'react';

interface TileViewProps {
  letter?: string;
  value?: number;
  isSelected?: boolean;
}

class TileView extends React.Component<TileViewProps> {
  defaultProps: {
    selected: false
  };

  render() {
    if (this.props.letter) {
      return (
        <div className={this.props.isSelected ? "tile selected" : "tile"}>
          {this.props.letter}
          <div className='value'>{this.props.value}</div>
        </div>
      );
    } else {
      return (
        <div className='tile empty'/>
      );
    }
  }
}

export default TileView;