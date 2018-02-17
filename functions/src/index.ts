import * as functions from 'firebase-functions';
import createReducer from '../../src/reducers/index';
import { Action } from '../../src/constants';

import * as admin from 'firebase-admin'
import { createState } from '../../src/state';
admin.initializeApp(functions.config().firebase);

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const handleAction = functions.database.ref('/rooms/{room}/messageQueue')
  .onWrite(event => {
    const actionObj = event.data.val() as {string: Action}
    const actions = Object.keys(actionObj).map(k => actionObj[k])
    console.log(actions)

    return event.data.ref.parent.child('game').once('value').then((snapshot) => {
      let state = snapshot.val()
      console.log("Received snapshot", snapshot.val())

      if (!state) {
        state = createState()
        console.log("Created state")
        console.log(state)
      }

      const reducer = createReducer(true)
      state = actions.reduce((s, a) => reducer(s, a), state)
      console.log("Finished reducing")
      console.log(state)

      return Promise.all([
        event.data.ref.remove(),
        snapshot.ref.set(state)
      ]);
    })
  })