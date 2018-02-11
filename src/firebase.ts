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

  public isDirty: boolean

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

  // Returns username
  public registerAsClient(dispatch: Dispatch): string {
    const userRef = database()
      .ref(`/rooms/${this.room}/users`)
      .push(true)
    this.gameRef().on('value', snapshot => {
      if (snapshot) {
        const val: State = snapshot.val()
        console.log('New state', val)
        this.isDirty = false
        dispatch(overwriteState(val))
      }
    })
    if (userRef.key) {
      return userRef.key
    } else {
      // TODO: lol
      return '' + Math.floor(Math.random() * 10000)
    }
  }

  public dispatch = (action: Action) => {
    if ((action.type as string) === '@@redux/INIT') {
      return
    }

    if (this.isDirty) {
      console.log('Is dirty, not dispatching', action)
      return
    }

    console.log('Pushing action to remote messageQueue', action)
    console.log(this)
    this.queueRef().push(action)

    this.isDirty = true
  }

  //

  private gameRef(): database.Reference {
    return database().ref(`/rooms/${this.room}/game`)
  }

  private queueRef(): database.Reference {
    return database().ref(`/rooms/${this.room}/messageQueue`)
  }
}
