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

const App = (props: AppProps) => {
  return (
    <div className="App">
      <BoardView player={props.rackName} />
      <RackView player={props.rackName} />
    </div>
  )
}

export default DragDropContext(MultiBackend(HTML5toTouch))(App)
