import { initializeApp, database } from 'firebase';

import { State } from './state';
import { Dispatch } from './constants';
import { overwriteState } from './actions';

const config = {
  apiKey: "AIzaSyBCYsA0yLwjhayv7NUQ5llqUB9IEQQmPEo",
  authDomain: "word-temple.firebaseapp.com",
  databaseURL: "https://word-temple.firebaseio.com",
  projectId: "word-temple",
  storageBucket: "word-temple.appspot.com",
  messagingSenderId: "285498223515"
};
export function initializeFirebase() {
  initializeApp(config);
}

export function sendNewState(state: State) {
  console.log("Sending new state");
  database().ref('game').set(state);
}

export function subscribeToState(dispatch: Dispatch) {
  const ref = database().ref('game/');
  ref.on('value', (snapshot) => {
    console.log("Data changed upstream");
    if (snapshot) {
      console.log("Had snapshot");
      const val: State = snapshot.val();
      dispatch(overwriteState(val));
    }
  });
}