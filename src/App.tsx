import * as React from 'react';
import './App.css';

import BoardView from './components/BoardView';
import RackView from './components/RackView';

import { checkWord } from './Board';

import { Tile } from './Tile';
import TileBag from './TileBag';

class App extends React.Component {
  render() {
    let bag = new TileBag();
    let hand: Tile[];
    [hand, bag] = bag.drawHand();

    const tiles = [
      {x: 0, y: 1, letter: 'R', value: 3},
      {x: 1, y: 1, letter: 'A', value: 1},
      {x: 2, y: 1, letter: 'T', value: 1},
      {x: 3, y: 5, letter: 'Z', value: 10}
    ];

    const cat = [tiles[0], tiles[1], tiles[2]];
    console.log(checkWord(cat));
    return (
      <div className="App">
        <BoardView
          tiles={tiles}
          size={7}
        />
        <RackView tiles={hand} />
      </div>
    );
  }
}

export default App;
