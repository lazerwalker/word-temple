import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import createReducer from './reducers'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import TileBag from './TileBag'
import { createNewRack } from './actions'

import * as firebase from './firebase'
firebase.initializeFirebase()

var initReactFastclick = require('react-fastclick')
initReactFastclick()

let bag = new TileBag()

const tiles = [
  { x: 0, y: 1, letter: 'R', value: 3, id: 'RX' },
  { x: 1, y: 1, letter: 'A', value: 1, id: 'AX' },
  { x: 2, y: 1, letter: 'T', value: 1, id: 'TX' },
  { x: 3, y: 5, letter: 'Z', value: 10, id: 'ZX' },
]
const board = { tiles, size: 7 }

const isHost = !window.location.hash
const reducer = createReducer(isHost, firebase.dispatch)

let store = createStore(
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
