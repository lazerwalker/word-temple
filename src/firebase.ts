import { database, initializeApp } from 'firebase'

import { overwriteState } from './actions'
import { Action, Dispatch } from './constants'
import { State } from './state'

const config = {
  apiKey: 'AIzaSyBCYsA0yLwjhayv7NUQ5llqUB9IEQQmPEo',
  authDomain: 'word-temple.firebaseapp.com',
  databaseURL: 'https://word-temple.firebaseio.com',
  messagingSenderId: '285498223515',
  projectId: 'word-temple',
  storageBucket: 'word-temple.appspot.com',
}
export function initializeFirebase() {
  initializeApp(config)
}

export function sendNewState(state: State) {
  console.log('Sending new state', state)
  database()
    .ref('game')
    .set(state)
}

export function wireQueueToDispatch(dispatch: Dispatch) {
  const ref = database().ref('/messageQueue')
  ref.on('child_added', snapshot => {
    if (snapshot) {
      // TODO: Whitelist actions
      const val: Action = snapshot.val()
      console.log('Received message', val)
      dispatch(val)
      snapshot.ref.remove()
    }
  })
}

export function subscribeToState(dispatch: Dispatch) {
  console.log('Subscribing to state')
  const ref = database().ref('game/')
  ref.on('value', snapshot => {
    if (snapshot) {
      const val: State = snapshot.val()
      console.log('New state', val)
      dispatch(overwriteState(val))
    }
  })
}

export function dispatch(action: Action) {
  console.log('Pushing action to remote messageQueue', action)
  database()
    .ref('/messageQueue')
    .push(action)
}
