import * as React from 'react'

// TODO: We should probably have a separate EmptyTileView so these can be not-optional
interface TileViewProps {
  letter?: string
  value?: number
  validity?: string
  movable?: boolean
}

const TileView = (props: TileViewProps) => {
  if (props.letter) {
    const classes = ['tile']
    if (props.validity) {
      classes.push(props.validity)
    }
    if (props.movable === false) {
      classes.push('immovable')
    }

    return (
      <div className={classes.join(' ')}>
        <div className="letter">{props.letter}</div>
        <div className="value">{props.value}</div>
      </div>
    )
  } else {
    return <div className="tile empty" />
  }
}

export default TileView
