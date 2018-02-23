import * as classNames from 'classnames'
import * as React from 'react'

// TODO: We should probably have a separate EmptyTileView so these can be not-optional
interface TileViewProps {
  letter?: string
  value?: number
  validity?: string
  movable?: boolean
  isDragging?: boolean
}

const TileView = (props: TileViewProps) => {
  if (props.letter) {
    const classes = classNames('tile', props.validity, {
      dragging: props.isDragging === true,
      immovable: props.movable === false,
    })

    return (
      <div className={classes}>
        <div className="letter">{props.letter}</div>
        <div className="value">{props.value}</div>
      </div>
    )
  } else {
    return <div className="tile empty" />
  }
}

export default TileView
