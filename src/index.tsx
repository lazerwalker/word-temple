import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './App'
import './index.css'
import createReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

import { createNewRack, generateBoard } from './actions'

import WebsocketAdapter from './networkAdapters/websocket'
import { createState } from './state'

document.ontouchmove = e => {
  e.preventDefault()
}

// tslint:disable-next-line:no-var-requires
const initReactFastclick = require('react-fastclick')
initReactFastclick()

const isHost = window.location.hash === ''
const adapter = new WebsocketAdapter(isHost) // new FirebaseAdapter(room)
const reducer = createReducer(isHost, adapter.dispatch)

const store = createStore(reducer, createState())

let name

if (isHost) {
  name = 'host'
  adapter.registerAsHost(store.dispatch)
  store.subscribe(() => {
    const state = store.getState()
    if (state) {
      adapter.sendNewState(state)
    }
  })

  store.dispatch(createNewRack('host'))
  store.dispatch(generateBoard(7))
} else {
  console.log('Is client')
  name = adapter.registerAsClient(store.dispatch)
  adapter.dispatch(createNewRack(name))
}

ReactDOM.render(
  <Provider store={store}>
    <App rackName={name} />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
