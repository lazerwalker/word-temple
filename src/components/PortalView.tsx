import classNames from 'classnames'
import * as React from 'react'

import { Side } from '../Board'

interface Props {
  side: Side
  open: boolean
  x: number
  y: number
  onSelect: (x: number, y: number) => void
}

export default class PortalView extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(args: any) {
    super(args)
    this.handleClick = this.handleClick.bind(this)
  }

  public render() {
    const { side, open } = this.props
    const classes = classNames('portal', 'exit', `portal-${side}`, {
      'portal-open': open,
    })
    return <div className={classes} onClick={this.handleClick} />
  }

  public handleClick() {
    this.props.onSelect(this.props.x, this.props.y)
  }
}
