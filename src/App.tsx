import * as React from 'react';
import './App.css';

import BoardView from './components/BoardView';
import RackView from './components/RackView';

class App extends React.Component {
  render() {

    return (
      <div className="App">
        <BoardView player="host"/>
        <RackView player="host"/>
      </div>
    );
  }
}

export default App;
