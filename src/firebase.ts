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

export default class Firebase {
  protected room: string

  constructor(room: string = 'default') {
    this.room = room
    initializeApp(config)
  }

  public sendNewState(state: State) {
    console.log('Sending new state', state)
    this.gameRef().set(state)
  }

  public wireQueueToDispatch(dispatch: Dispatch, room: string = 'default') {
    this.queueRef().remove()
    this.queueRef().on('child_added', snapshot => {
      if (snapshot) {
        // TODO: Whitelist actions
        const val: Action = snapshot.val()
        console.log('Received message', val)
        dispatch(val)
        snapshot.ref.remove()
      }
    })
  }

  public subscribeToState(dispatch: Dispatch) {
    this.gameRef().on('value', snapshot => {
      if (snapshot) {
        const val: State = snapshot.val()
        console.log('New state', val)
        dispatch(overwriteState(val))
      }
    })
  }

  public dispatch = (action: Action) => {
    console.log('Pushing action to remote messageQueue', action)
    console.log(this)
    this.queueRef().push(action)
  }

  //

  private gameRef(): database.Reference {
    return database().ref(`/rooms/${this.room}/game`)
  }

  private queueRef(): database.Reference {
    return database().ref(`/rooms/${this.room}/messageQueue`)
  }
}
