import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import TileBag from './TileBag';
import { createNewRack } from './actions';

import NetworkClient from './networking';

let bag = new TileBag();

const tiles = [
  {x: 0, y: 1, letter: 'R', value: 3},
  {x: 1, y: 1, letter: 'A', value: 1},
  {x: 2, y: 1, letter: 'T', value: 1},
  {x: 3, y: 5, letter: 'Z', value: 10}
];
const board = { tiles, size: 7 };

let store = createStore(reducer,
                        {racks: {}, board, bag},
                        applyMiddleware(thunk));

const isHost = (!window.location.hash);
const network = NetworkClient(isHost, store);
(window as any).network = network;
(window as any).isHost = isHost;

if (isHost) {
  store.subscribe(() => {
    console.log("NEW STATE", store.getState());
    (network as any).sendNewState(store.getState());
  });

  store.dispatch(createNewRack("host"));
}

console.log(network);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
