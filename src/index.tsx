import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import TileBag from './TileBag';
import { Tile } from './Tile';

let bag = new TileBag();
let hand: Tile[];
[hand, bag] = bag.drawHand();

const rack = {
  tiles: hand
};

const tiles = [
  {x: 0, y: 1, letter: 'R', value: 3},
  {x: 1, y: 1, letter: 'A', value: 1},
  {x: 2, y: 1, letter: 'T', value: 1},
  {x: 3, y: 5, letter: 'Z', value: 10}
];
const board = { tiles, size: 7 };

let store = createStore(reducer, {rack, board});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
