import * as React from 'react'
import './App.css'

import { DragDropContext } from 'react-dnd'
import MultiBackend, { Preview } from 'react-dnd-multi-backend'
// tslint:disable-next-line:no-submodule-imports
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'
import BoardView from './components/BoardView'
import RackView from './components/RackView'
// import TileView from './components/TileView'
import { DragBoardTile, DragTile } from './constants'

interface AppProps {
  rackName: string
}

class App extends React.Component<AppProps> {
  public render() {
    const { rackName } = this.props
    return (
      <div className="App">
        <BoardView player={rackName} />
        <RackView player={rackName} />
        <Preview generator={this.generatePreview} />
      </div>
    )
  }

  private generatePreview(
    type: string,
    item: DragTile | DragBoardTile,
    style: object
  ) {
    const theStyle = { ...style }
    console.log(item.letter)
    return (
      <div className="tile" style={theStyle}>
        <div className="letter">{item.letter}</div>
        <div className="value">{item.value}</div>
      </div>
    )
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(App)
