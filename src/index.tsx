import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import App from './App'
import './index.css'
import createReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

import { createNewRack, generateBoard } from './actions'
import TileBag from './TileBag'

import Firebase from './firebase'
const firebase = new Firebase()

document.ontouchmove = e => {
  e.preventDefault()
}

// tslint:disable-next-line:no-var-requires
const initReactFastclick = require('react-fastclick')
initReactFastclick()

const bag = new TileBag()

const isHost = !window.location.hash
const reducer = createReducer(isHost, firebase.dispatch)

// TODO: Time to make a constructor?
const board = {
  size: 7,
  tiles: [],
}
const store = createStore(
  reducer,
  { racks: {}, board, bag },
  applyMiddleware(thunk)
)

let name

if (isHost) {
  name = 'host'
  firebase.wireQueueToDispatch(store.dispatch)
  store.subscribe(() => {
    const state = store.getState()
    if (state) {
      firebase.sendNewState(state)
    }
  })

  store.dispatch(createNewRack('host'))
  store.dispatch(generateBoard(7))
} else {
  console.log('Is client')
  name = firebase.registerAsClient(store.dispatch)
  firebase.dispatch(createNewRack(name))
}

ReactDOM.render(
  <Provider store={store}>
    <App rackName={name} />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
