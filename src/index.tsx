import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './App'
import './index.css'
import createReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

import { createNewRack, generateBoard } from './actions'

import Firebase from './firebase'
import { createState } from './state'

const room =
  window.location.hash === '' ? undefined : window.location.hash.slice(1)

const firebase = new Firebase(room)

document.ontouchmove = e => {
  e.preventDefault()
}

// tslint:disable-next-line:no-var-requires
const initReactFastclick = require('react-fastclick')
initReactFastclick()

const isHost = window.location.hash === ''
const reducer = createReducer(isHost, firebase.dispatch)

const store = createStore(reducer, createState())

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
