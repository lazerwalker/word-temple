import * as React from 'react';
import './App.css';

import BoardView from './components/BoardView';
import RackView from './components/RackView';

class App extends React.Component {
  render() {
    const tiles = [
      {x: 0, y: 1, letter: 'R', value: 3},
      {x: 1, y: 1, letter: 'A', value: 1},
      {x: 2, y: 1, letter: 'T', value: 1},
      {x: 3, y: 5, letter: 'Z', value: 10}
    ];

    return (
      <div className="App">
        <BoardView
          tiles={tiles}
          size={7}
        />
        <RackView />
      </div>
    );
  }
}

export default App;
