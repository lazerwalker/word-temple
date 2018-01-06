import * as React from 'react';

interface TileViewProps {
  letter?: string;
}

class TileView extends React.Component<TileViewProps> {
  render() {
    if (this.props.letter) {
      return (
        <div className='tile'>
          {this.props.letter}
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