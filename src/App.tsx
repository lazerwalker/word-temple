import * as React from 'react';
import './App.css';
import Board from './components/BoardView';

class App extends React.Component {
  render() {
    const tiles = [
      {x: 1, y: 1, letter: 'A'},
      {x: 3, y: 5, letter: 'Z'}
    ];

    return (
      <div className="App">
        <Board
          tiles={tiles}
          size={7}
        />
      </div>
    );
  }
}

export default App;
