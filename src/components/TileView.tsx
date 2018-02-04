import * as React from 'react';

interface TileViewProps {
  letter?: string;
  value?: number;
  isSelected?: boolean;
  validity?: string;
}

class TileView extends React.Component<TileViewProps> {
  defaultProps: {
    selected: false
  };

  render() {
    if (this.props.letter) {
      let classes = ["tile"];
      if (this.props.isSelected) {
        classes.push("selected");
      }
      if (this.props.validity) {
        classes.push(this.props.validity);
      }

      return (
        <div className={classes.join(" ")}>
          <div className='letter'>{this.props.letter}</div>
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