import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import App from './App'
import './index.css'
import createReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

import { createNewRack } from './actions'
import TileBag from './TileBag'

import { Side } from './Board'
import * as firebase from './firebase'
firebase.initializeFirebase()

// tslint:disable-next-line:no-var-requires
const initReactFastclick = require('react-fastclick')
initReactFastclick()

const bag = new TileBag()

const tiles = [
  { x: 0, y: 1, letter: 'R', value: 3, id: 'RX' },
  { x: 1, y: 1, letter: 'A', value: 1, id: 'AX' },
  { x: 2, y: 1, letter: 'T', value: 1, id: 'TX' },
  { x: 3, y: 5, letter: 'Z', value: 10, id: 'ZX' },
]

const entrance = {
  position: 1,
  side: Side.Left,
}

const exit = {
  position: 5,
  side: Side.Bottom,
}

const board = { tiles, entrance, exit, size: 7 }

const isHost = !window.location.hash
const reducer = createReducer(isHost, firebase.dispatch)

const store = createStore(
  reducer,
  { racks: {}, board, bag },
  applyMiddleware(thunk)
)

if (isHost) {
  firebase.wireQueueToDispatch(store.dispatch)
  store.subscribe(() => {
    const state = store.getState()
    if (state) {
      firebase.sendNewState(state)
    }
  })

  store.dispatch(createNewRack('host'))
} else {
  console.log('Is client')
  firebase.dispatch(createNewRack('client'))
  firebase.subscribeToState(store.dispatch)
}

ReactDOM.render(
  <Provider store={store}>
    <App rackName={isHost ? 'host' : 'client'} />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
