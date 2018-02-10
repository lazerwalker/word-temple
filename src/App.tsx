import * as React from 'react'
import './App.css'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
// tslint:disable-next-line:no-submodule-imports
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'
import BoardView from './components/BoardView'
import RackView from './components/RackView'

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
      </div>
    )
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(App)
