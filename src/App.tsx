import * as React from 'react'
import './App.css'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import BoardView from './components/BoardView'
import RackView from './components/RackView'

interface AppProps {
  rackName: string
}

class App extends React.Component<AppProps> {
  public render() {
    return (
      <div className="App">
        <BoardView player={this.props.rackName} />
        <RackView />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
