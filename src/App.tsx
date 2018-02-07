import * as React from 'react'
import './App.css'

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
        <RackView player={this.props.rackName} />
      </div>
    )
  }
}

export default App
